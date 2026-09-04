const User = require('../models/User');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Sale = require('../models/Sale');
const Production = require('../models/Production');

exports.exportData = async (req,res) => {
  const userId=req.userId;
  res.json({
    exportedAt:new Date().toISOString(),
    user:await User.findById(userId).select('-password'),
    products:await Product.find({userId}),
    stock:await Stock.find({userId}),
    sales:await Sale.find({userId}),
    productions:await Production.find({userId})
  });
};