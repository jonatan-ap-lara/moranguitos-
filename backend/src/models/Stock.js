const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['insumo', 'produto', 'embalagem', 'outro'], required: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  unit: { type: String, required: true, enum: ['kg', 'g', 'l', 'ml', 'un', 'pacote', 'caixa'] },
  unitPrice: { type: Number, required: true, min: 0 },
  minimumStock: { type: Number, default: 0, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

stockSchema.index({ userId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Stock', stockSchema);