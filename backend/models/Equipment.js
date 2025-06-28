import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Equipment type is required'],
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
  manufacturer: {
    type: String,
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required']
  },
  warrantyExpiry: {
    type: Date
  },
  location: {
    type: String,
    required: [true, 'Equipment location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['functional', 'maintenance', 'broken', 'retired'],
    default: 'functional'
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  nextMaintenance: {
    type: Date,
    required: [true, 'Next maintenance date is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedDate: {
    type: Date
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
    power: String,
    dimensions: String,
    weight: String,
    capacity: String
  },
  maintenanceHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    scheduledDate: Date,
    type: {
      type: String,
      enum: ['preventive', 'corrective', 'emergency', 'scheduled']
    },
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: Number,
    parts: [String],
    notes: String
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['maintenance-due', 'warranty-expiring', 'critical-condition', 'custom']
    },
    message: String,
    date: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
equipmentSchema.index({ name: 1 });
equipmentSchema.index({ type: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ nextMaintenance: 1 });
equipmentSchema.index({ assignedTo: 1 });
equipmentSchema.index({ serialNumber: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment; 