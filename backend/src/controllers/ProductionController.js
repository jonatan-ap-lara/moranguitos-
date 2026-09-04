const Production = require('../models/Production');
const Product = require('../models/Product');
const Stock = require('../models/Stock');

exports.createProduction = async (req, res) => {
  const session = await Production.startSession();
  session.startTransaction();
  try {
    const { productId, quantityProduced, notes } = req.body;
    const qty = Number(quantityProduced);
    if (!qty || qty < 1) throw new Error('Quantidade produzida inválida');
    const product = await Product.findOne({ _id: productId, userId: req.userId });
    if (!product) throw new Error('Produto não encontrado');

    let totalCost = 0, ingredientsUsed = [];
    for (const ingredient of product.ingredients || []) {
      const stockItem = await Stock.findOne({ _id: ingredient.stockItemId, userId: req.userId }).session(session);
      if (!stockItem) throw new Error(`Item de estoque não encontrado`);
      const quantityNeeded = ingredient.quantity * qty;
      if (stockItem.quantity < quantityNeeded) throw new Error(`Estoque insuficiente de ${stockItem.name}`);
      const cost = stockItem.unitPrice * quantityNeeded;
      totalCost += cost;
      ingredientsUsed.push({ stockItemId: stockItem._id, stockItemName: stockItem.name, quantity: quantityNeeded, unit: stockItem.unit, cost });
      stockItem.quantity -= quantityNeeded; stockItem.lastUpdated = new Date(); await stockItem.save({ session });
    }

    const production = new Production({
      userId: req.userId, productId, quantityProduced: qty, yield: qty,
      ingredientsUsed, totalCost, costPerUnit: totalCost / qty, notes
    });
    await production.save({ session });
    await session.commitTransaction();
    res.status(201).json(production);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally { session.endSession(); }
};

exports.getProductions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.userId, cancelled: false };
    if (startDate && endDate) filter.productionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    res.json(await Production.find(filter).populate('productId', 'name').sort({ productionDate: -1 }));
  } catch (error) { res.status(500).json({ message: 'Erro ao buscar produções', error: error.message }); }
};

exports.cancelProduction = async (req, res) => {
  const session = await Production.startSession();
  session.startTransaction();
  try {
    const production = await Production.findOne({ _id: req.params.id, userId: req.userId, cancelled: false }).session(session);
    if (!production) throw new Error('Produção não encontrada ou já cancelada');
    for (const ingredient of production.ingredientsUsed) {
      const stockItem = await Stock.findOne({ _id: ingredient.stockItemId, userId: req.userId }).session(session);
      if (stockItem) { stockItem.quantity += ingredient.quantity; stockItem.lastUpdated = new Date(); await stockItem.save({ session }); }
    }
    production.cancelled = true; production.cancelledAt = new Date(); await production.save({ session });
    await session.commitTransaction();
    res.json({ message: 'Produção cancelada com sucesso' });
  } catch (error) {
    await session.abortTransaction(); res.status(400).json({ message: error.message });
  } finally { session.endSession(); }
};