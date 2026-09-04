const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'outro'], required: true },
  notes: String,
  saleDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  cancelled: { type: Boolean, default: false },
  cancelledAt: Date
});

module.exports = mongoose.model('Sale', saleSchema);