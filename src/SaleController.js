const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
  try {
    const { items, paymentMethod, notes } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Nenhum item informado' });
    let totalAmount = 0, saleItems = [];
    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, userId: req.userId, active: true });
      if (!product) return res.status(400).json({ message: 'Produto não encontrado' });
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(item.unitPrice ?? product.price);
      const total = quantity * unitPrice;
      totalAmount += total;
      saleItems.push({ productId: product._id, productName: product.name, quantity, unitPrice, total });
    }
    const sale = await new Sale({ userId: req.userId, items: saleItems, totalAmount, paymentMethod, notes }).save();
    res.status(201).json(sale);
  } catch (error) { res.status(500).json({ message: 'Erro ao registrar venda', error: error.message }); }
};

exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate, paymentMethod } = req.query;
    const filter = { userId: req.userId, cancelled: { $ne: true } };
    if (startDate && endDate) filter.saleDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    res.json(await Sale.find(filter).sort({ saleDate: -1 }).limit(100));
  } catch (error) { res.status(500).json({ message: 'Erro ao buscar vendas', error: error.message }); }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.userId });
    if (!sale) return res.status(404).json({ message: 'Venda não encontrada' });
    res.json(sale);
  } catch (error) { res.status(500).json({ message: 'Erro ao buscar venda', error: error.message }); }
};

exports.cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.userId });
    if (!sale) return res.status(404).json({ message: 'Venda não encontrada' });
    sale.cancelled = true; sale.cancelledAt = new Date(); await sale.save();
    res.json({ message: 'Venda cancelada com sucesso' });
  } catch (error) { res.status(500).json({ message: 'Erro ao cancelar venda', error: error.message }); }
};