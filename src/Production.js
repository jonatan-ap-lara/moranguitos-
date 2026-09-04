const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityProduced: { type: Number, required: true, min: 1 },
  yield: { type: Number, min: 0 },
  ingredientsUsed: [{
    stockItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    stockItemName: String,
    quantity: { type: Number, required: true, min: 0 },
    unit: String,
    cost: { type: Number, required: true, min: 0 }
  }],
  totalCost: { type: Number, required: true, min: 0 },
  costPerUnit: { type: Number, required: true, min: 0 },
  productionDate: { type: Date, default: Date.now },
  notes: String,
  cancelled: { type: Boolean, default: false },
  cancelledAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Production', productionSchema);