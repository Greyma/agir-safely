import mongoose from 'mongoose';

const accidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Accident title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Accident description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Accident date is required'],
    default: Date.now
  },
  location: {
    type: String,
    required: [true, 'Accident location is required'],
    trim: true
  },
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe', 'critical'],
    required: [true, 'Severity level is required']
  },
  type: {
    type: String,
    enum: ['slip', 'fall', 'cut', 'burn', 'chemical', 'electrical', 'mechanical', 'other'],
    required: [true, 'Accident type is required']
  },
  injuredPerson: {
    name: String,
    age: Number,
    position: String
  },
  witnesses: [{
    name: String,
    contact: String
  }],
  immediateActions: [String],
  rootCause: String,
  preventiveMeasures: [String],
  status: {
    type: String,
    enum: ['reported', 'investigating', 'resolved', 'closed'],
    default: 'reported'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
accidentSchema.index({ date: -1 });
accidentSchema.index({ severity: 1 });
accidentSchema.index({ type: 1 });
accidentSchema.index({ reportedBy: 1 });

const Accident = mongoose.model('Accident', accidentSchema);

export default Accident; 