const Sale = require('../models/Sale');
const Production = require('../models/Production');
const Stock = require('../models/Stock');

exports.dashboard = async (req,res) => {
  try {
    const start = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now()-30*86400000);
    const end = req.query.endDate ? new Date(req.query.endDate+'T23:59:59.999') : new Date();
    const sales = await Sale.find({userId:req.userId,cancelled:{$ne:true},saleDate:{$gte:start,$lte:end}});
    const productions = await Production.find({userId:req.userId,cancelled:false,productionDate:{$gte:start,$lte:end}});
    const lowStockItems = await Stock.find({userId:req.userId,$expr:{$lte:['$quantity','$minimumStock']}});
    const totalRevenue = sales.reduce((s,x)=>s+x.totalAmount,0);
    const totalCost = productions.reduce((s,x)=>s+x.totalCost,0);
    res.json({totalRevenue,totalSales:sales.length,totalProfit:totalRevenue-totalCost,totalProductions:productions.length,
      salesByDay:[],salesByProduct:[],lowStockItems});
  } catch(e){res.status(500).json({message:'Erro ao carregar dashboard',error:e.message});}
};

exports.summary = async (req,res) => {
  const sales = await Sale.find({userId:req.userId,cancelled:{$ne:true}}).sort({saleDate:-1}).limit(500);
  res.json({sales, revenue:sales.reduce((s,x)=>s+x.totalAmount,0)});
};