import mongoose from 'mongoose';

const ppeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'PPE name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['head', 'eye', 'ear', 'respiratory', 'hand', 'foot', 'body', 'fall-protection'],
    required: [true, 'PPE category is required']
  },
  description: {
    type: String,
    required: [true, 'PPE description is required'],
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  expiryDate: {
    type: Date
  },
  lastInspection: {
    type: Date,
    default: Date.now
  },
  nextInspection: {
    type: Date,
    required: [true, 'Next inspection date is required']
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged'],
    default: 'good'
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance', 'retired', 'lost'],
    default: 'available'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Storage location is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    enum: ['piece', 'pair', 'set', 'box'],
    default: 'piece'
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  specifications: {
    material: String,
    size: String,
    color: String,
    weight: String,
    certifications: [String]
  },
  maintenanceHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['inspection', 'cleaning', 'repair', 'replacement']
    },
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: Number
  }],
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
ppeSchema.index({ category: 1 });
ppeSchema.index({ status: 1 });
ppeSchema.index({ assignedTo: 1 });
ppeSchema.index({ nextInspection: 1 });
ppeSchema.index({ serialNumber: 1 });

const PPE = mongoose.model('PPE', ppeSchema);

export default PPE; 