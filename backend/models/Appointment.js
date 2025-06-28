import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['medical-checkup', 'consultation', 'emergency', 'follow-up', 'vaccination', 'screening'],
    required: [true, 'Appointment type is required']
  },
  description: {
    type: String,
    trim: true
  },
  doctor: {
    name: String,
    specialty: String,
    contact: String
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  notes: String,
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: Date,
  cancellationReason: String,
  cancellationDate: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ userId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ type: 1 });
appointmentSchema.index({ priority: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 