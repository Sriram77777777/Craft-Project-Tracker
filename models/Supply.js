import mongoose from 'mongoose';

const SupplySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a supply name'],
    trim: true,
    maxlength: [100, 'Supply name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['yarn', 'fabric', 'thread', 'needles', 'tools', 'patterns', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  unit: {
    type: String,
    default: 'pieces',
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Supply || mongoose.model('Supply', SupplySchema);
