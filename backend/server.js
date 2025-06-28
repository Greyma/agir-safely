import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/User.js';
import Accident from './models/Accident.js';
import PPE from './models/PPE.js';
import ChemicalProduct from './models/ChemicalProduct.js';
import Equipment from './models/Equipment.js';
import Disease from './models/Disease.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://192.168.1.5:8081',
    'http://192.168.1.5:8082',
    'exp://192.168.1.5:8081',
    'exp://192.168.1.5:8082',
    // Production Render domain
    'https://agir-safely-backend.onrender.com',
    // Allow all origins for development (remove in production)
    '*'
  ],
  credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Agir Safely API is running!' });
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      name
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: newUser.toJSON()
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/auth/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: 'This is a protected route',
    user: req.user 
  });
});

// ===== ACCIDENT ROUTES =====

// Get all accidents
app.get('/api/accidents', authenticateToken, async (req, res) => {
  try {
    const accidents = await Accident.find()
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ date: -1 });
    
    res.json(accidents);
  } catch (error) {
    console.error('Get accidents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new accident
app.post('/api/accidents', authenticateToken, async (req, res) => {
  try {
    const accidentData = {
      ...req.body,
      reportedBy: req.user.userId
    };

    const accident = new Accident(accidentData);
    await accident.save();

    const populatedAccident = await Accident.findById(accident._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedAccident);
  } catch (error) {
    console.error('Create accident error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get accident by ID
app.get('/api/accidents/:id', authenticateToken, async (req, res) => {
  try {
    const accident = await Accident.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!accident) {
      return res.status(404).json({ message: 'Accident not found' });
    }

    res.json(accident);
  } catch (error) {
    console.error('Get accident error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update accident
app.put('/api/accidents/:id', authenticateToken, async (req, res) => {
  try {
    const accident = await Accident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email')
     .populate('assignedTo', 'name email');

    if (!accident) {
      return res.status(404).json({ message: 'Accident not found' });
    }

    res.json(accident);
  } catch (error) {
    console.error('Update accident error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== PPE ROUTES =====

// Get all PPE
app.get('/api/ppe', authenticateToken, async (req, res) => {
  try {
    const ppe = await PPE.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(ppe);
  } catch (error) {
    console.error('Get PPE error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new PPE
app.post('/api/ppe', authenticateToken, async (req, res) => {
  try {
    const ppe = new PPE(req.body);
    await ppe.save();

    const populatedPPE = await PPE.findById(ppe._id)
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedPPE);
  } catch (error) {
    console.error('Create PPE error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get PPE by ID
app.get('/api/ppe/:id', authenticateToken, async (req, res) => {
  try {
    const ppe = await PPE.findById(req.params.id)
      .populate('assignedTo', 'name email');
    
    if (!ppe) {
      return res.status(404).json({ message: 'PPE not found' });
    }
    
    res.json(ppe);
  } catch (error) {
    console.error('Get PPE error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== CHEMICAL PRODUCT ROUTES =====

// Get all chemical products
app.get('/api/chemicals', authenticateToken, async (req, res) => {
  try {
    const chemicals = await ChemicalProduct.find()
      .populate('responsiblePerson', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(chemicals);
  } catch (error) {
    console.error('Get chemicals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new chemical product
app.post('/api/chemicals', authenticateToken, async (req, res) => {
  try {
    const chemicalData = {
      ...req.body,
      responsiblePerson: req.user.userId
    };

    const chemical = new ChemicalProduct(chemicalData);
    await chemical.save();

    const populatedChemical = await ChemicalProduct.findById(chemical._id)
      .populate('responsiblePerson', 'name email');

    res.status(201).json(populatedChemical);
  } catch (error) {
    console.error('Create chemical error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get chemical product by ID
app.get('/api/chemicals/:id', authenticateToken, async (req, res) => {
  try {
    const chemical = await ChemicalProduct.findById(req.params.id)
      .populate('responsiblePerson', 'name email');
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical product not found' });
    }

    res.json(chemical);
  } catch (error) {
    console.error('Get chemical error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update chemical product
app.put('/api/chemicals/:id', authenticateToken, async (req, res) => {
  try {
    const chemical = await ChemicalProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('responsiblePerson', 'name email');

    if (!chemical) {
      return res.status(404).json({ message: 'Chemical product not found' });
    }

    res.json(chemical);
  } catch (error) {
    console.error('Update chemical error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete chemical product
app.delete('/api/chemicals/:id', authenticateToken, async (req, res) => {
  try {
    const chemical = await ChemicalProduct.findByIdAndDelete(req.params.id);
    
    if (!chemical) {
      return res.status(404).json({ message: 'Chemical product not found' });
    }

    res.json({ message: 'Chemical product deleted successfully' });
  } catch (error) {
    console.error('Delete chemical error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== PPE ROUTES (Additional) =====

// Update PPE
app.put('/api/ppe/:id', authenticateToken, async (req, res) => {
  try {
    const ppe = await PPE.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!ppe) {
      return res.status(404).json({ message: 'PPE not found' });
    }

    res.json(ppe);
  } catch (error) {
    console.error('Update PPE error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete PPE
app.delete('/api/ppe/:id', authenticateToken, async (req, res) => {
  try {
    const ppe = await PPE.findByIdAndDelete(req.params.id);
    
    if (!ppe) {
      return res.status(404).json({ message: 'PPE not found' });
    }

    res.json({ message: 'PPE deleted successfully' });
  } catch (error) {
    console.error('Delete PPE error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Report PPE damage
app.post('/api/ppe/:id/damage', authenticateToken, async (req, res) => {
  try {
    const { description, severity } = req.body;
    
    const ppe = await PPE.findById(req.params.id);
    if (!ppe) {
      return res.status(404).json({ message: 'PPE not found' });
    }

    // Add damage report to maintenance history
    ppe.maintenanceHistory.push({
      date: new Date(),
      type: 'repair',
      description: description || 'Damage reported',
      performedBy: req.user.userId,
      cost: 0
    });

    // Update condition if severe damage
    if (severity === 'severe') {
      ppe.condition = 'damaged';
    }

    await ppe.save();

    const populatedPPE = await PPE.findById(ppe._id)
      .populate('assignedTo', 'name email');

    res.json(populatedPPE);
  } catch (error) {
    console.error('Report PPE damage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== EQUIPMENT/MAINTENANCE ROUTES =====

// Get all equipment
app.get('/api/equipment', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new equipment
app.post('/api/equipment', authenticateToken, async (req, res) => {
  try {
    const equipmentData = {
      ...req.body,
      assignedTo: req.user.userId
    };

    const equipment = new Equipment(equipmentData);
    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedEquipment);
  } catch (error) {
    console.error('Create equipment error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get equipment by ID
app.get('/api/equipment/:id', authenticateToken, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('assignedTo', 'name email');
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update equipment status
app.put('/api/equipment/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Update equipment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Schedule maintenance
app.post('/api/equipment/:id/maintenance', authenticateToken, async (req, res) => {
  try {
    const { scheduledDate, description, type } = req.body;
    
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Add maintenance record
    equipment.maintenanceHistory.push({
      date: new Date(),
      scheduledDate: new Date(scheduledDate),
      type: type || 'scheduled',
      description: description || 'Maintenance scheduled',
      performedBy: req.user.userId,
      cost: 0
    });

    // Update status to maintenance
    equipment.status = 'maintenance';

    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('assignedTo', 'name email');

    res.json(populatedEquipment);
  } catch (error) {
    console.error('Schedule maintenance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ===== OCCUPATIONAL DISEASES ROUTES =====

// Get all diseases
app.get('/api/diseases', authenticateToken, async (req, res) => {
  try {
    const diseases = await Disease.find().sort({ createdAt: -1 });
    res.json(diseases);
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new disease record
app.post('/api/diseases', authenticateToken, async (req, res) => {
  try {
    const diseaseData = {
      ...req.body,
      reportedBy: req.user.userId
    };

    const disease = new Disease(diseaseData);
    await disease.save();

    const populatedDisease = await Disease.findById(disease._id)
      .populate('reportedBy', 'name email');

    res.status(201).json(populatedDisease);
  } catch (error) {
    console.error('Create disease error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Schedule appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { date, time, type, description } = req.body;
    
    const appointment = new Appointment({
      date: new Date(date),
      time,
      type,
      description,
      userId: req.user.userId,
      status: 'scheduled'
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Schedule appointment error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.userId })
      .populate('userId', 'name email')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}`);
  console.log(`🌐 Network URL: http://192.168.1.5:${PORT}`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log(`🗄️  Database: MongoDB`);
}); 