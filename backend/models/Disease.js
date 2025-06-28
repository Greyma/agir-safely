import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Disease name is required'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Disease description is required'],
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  riskFactors: [{
    type: String,
    trim: true
  }],
  prevention: [{
    type: String,
    trim: true
  }],
  treatment: [{
    type: String,
    trim: true
  }],
  riskSector: {
    type: String,
    required: [true, 'Risk sector is required'],
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  icd10Code: {
    type: String,
    trim: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring'],
    default: 'active'
  },
  affectedWorkers: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    diagnosisDate: Date,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    treatmentStatus: {
      type: String,
      enum: ['ongoing', 'completed', 'monitoring']
    },
    notes: String
  }],
  preventionMeasures: [{
    measure: String,
    implementationDate: Date,
    responsiblePerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['planned', 'implemented', 'monitoring', 'completed']
    },
    effectiveness: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  }],
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
diseaseSchema.index({ name: 1 });
diseaseSchema.index({ riskSector: 1 });
diseaseSchema.index({ severity: 1 });
diseaseSchema.index({ status: 1 });
diseaseSchema.index({ reportedBy: 1 });

const Disease = mongoose.model('Disease', diseaseSchema);

export default Disease; 