import mongoose from 'mongoose';

const chemicalProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  chemicalName: {
    type: String,
    required: [true, 'Chemical name is required'],
    trim: true
  },
  casNumber: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  category: {
    type: String,
    enum: ['acid', 'base', 'solvent', 'oxidizer', 'flammable', 'toxic', 'corrosive', 'other'],
    required: [true, 'Chemical category is required']
  },
  hazardClass: {
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    required: [true, 'Hazard class is required']
  },
  physicalState: {
    type: String,
    enum: ['solid', 'liquid', 'gas', 'aerosol'],
    required: [true, 'Physical state is required']
  },
  concentration: {
    value: Number,
    unit: {
      type: String,
      enum: ['%', 'M', 'N', 'ppm', 'mg/L', 'g/L']
    }
  },
  quantity: {
    amount: {
      type: Number,
      required: [true, 'Quantity amount is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      enum: ['L', 'mL', 'kg', 'g', 'pieces', 'bottles'],
      required: [true, 'Quantity unit is required']
    }
  },
  location: {
    type: String,
    required: [true, 'Storage location is required'],
    trim: true
  },
  storageConditions: {
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['°C', '°F'],
        default: '°C'
      }
    },
    humidity: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        default: '%'
      }
    },
    specialRequirements: [String]
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
  status: {
    type: String,
    enum: ['active', 'expired', 'disposed', 'quarantine'],
    default: 'active'
  },
  safetyDataSheet: {
    available: {
      type: Boolean,
      default: false
    },
    url: String,
    lastUpdated: Date
  },
  hazards: [{
    type: String,
    enum: ['flammable', 'toxic', 'corrosive', 'oxidizing', 'explosive', 'irritant', 'sensitizing', 'carcinogenic', 'mutagenic', 'reproductive-toxic']
  }],
  precautionaryMeasures: [String],
  emergencyProcedures: {
    spill: String,
    fire: String,
    exposure: String,
    firstAid: String
  },
  ppeRequired: [{
    type: String,
    enum: ['gloves', 'goggles', 'respirator', 'lab-coat', 'face-shield', 'boots']
  }],
  disposalMethod: {
    type: String,
    enum: ['hazardous-waste', 'recycling', 'neutralization', 'incineration', 'landfill'],
    required: [true, 'Disposal method is required']
  },
  responsiblePerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
chemicalProductSchema.index({ name: 1 });
chemicalProductSchema.index({ category: 1 });
chemicalProductSchema.index({ status: 1 });
chemicalProductSchema.index({ nextInspection: 1 });
chemicalProductSchema.index({ responsiblePerson: 1 });
chemicalProductSchema.index({ casNumber: 1 });

const ChemicalProduct = mongoose.model('ChemicalProduct', chemicalProductSchema);

export default ChemicalProduct; 