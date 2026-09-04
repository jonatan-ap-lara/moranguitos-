const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['doce', 'espetinho', 'outro'], required: true },
  price: { type: Number, required: true, min: 0 },
  description: String,
  ingredients: [{
    stockItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    quantity: { type: Number, required: true, min: 0 },
    unit: String
  }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.index({ userId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Product', productSchema);