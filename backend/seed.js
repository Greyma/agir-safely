import connectDB from './config/database.js';
import User from './models/User.js';
import ChemicalProduct from './models/ChemicalProduct.js';
import Disease from './models/Disease.js';
import PPE from './models/PPE.js';
import Equipment from './models/Equipment.js';
import Accident from './models/Accident.js';
import Appointment from './models/Appointment.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('Starting database seeding...');
    
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await ChemicalProduct.deleteMany({});
    await Disease.deleteMany({});
    await PPE.deleteMany({});
    await Equipment.deleteMany({});
    await Accident.deleteMany({});
    await Appointment.deleteMany({});
    
    console.log('Creating test user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    await testUser.save();
    
    console.log('Creating chemical products...');
    const chemicalProducts = [
      {
        name: 'Sulfuric Acid',
        chemicalName: 'Sulfuric Acid',
        casNumber: '7664-93-9',
        manufacturer: 'ChemCorp Industries',
        supplier: { name: 'SafetyChem Supply', contact: '123-456-7890', email: 'supply@safetychem.com' },
        category: 'acid',
        hazardClass: '8',
        physicalState: 'liquid',
        concentration: { value: 98, unit: '%' },
        quantity: { amount: 50, unit: 'L' },
        location: 'Chemical Storage Room A',
        storageConditions: { temperature: { min: 10, max: 25, unit: '°C' }, humidity: { min: 20, max: 60, unit: '%' }, specialRequirements: ['Keep container tightly closed'] },
        purchaseDate: new Date('2024-01-01'),
        expiryDate: new Date('2025-12-31'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        status: 'active',
        safetyDataSheet: { available: true, url: 'https://example.com/msds/sulfuric-acid.pdf', lastUpdated: new Date('2024-01-01') },
        hazards: ['corrosive'],
        precautionaryMeasures: ['Wear acid-resistant gloves', 'Use face shield'],
        emergencyProcedures: { spill: 'Neutralize with sodium bicarbonate', fire: 'Use dry sand', exposure: 'Flush with water', firstAid: 'Seek medical attention' },
        ppeRequired: ['gloves', 'goggles', 'lab-coat'],
        disposalMethod: 'hazardous-waste',
        responsiblePerson: testUser._id,
        notes: 'Handle with care.'
      },
      {
        name: 'Sodium Hydroxide',
        chemicalName: 'Sodium Hydroxide',
        casNumber: '1310-73-2',
        manufacturer: 'AlkaliChem Ltd',
        supplier: { name: 'Industrial Chemicals Co', contact: '987-654-3210', email: 'info@industrialchem.com' },
        category: 'base',
        hazardClass: '8',
        physicalState: 'solid',
        concentration: { value: 100, unit: '%' },
        quantity: { amount: 25, unit: 'kg' },
        location: 'Chemical Storage Room B',
        storageConditions: { temperature: { min: 10, max: 30, unit: '°C' }, humidity: { min: 10, max: 50, unit: '%' }, specialRequirements: ['Store in dry place'] },
        purchaseDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-06-30'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        status: 'active',
        safetyDataSheet: { available: true, url: 'https://example.com/msds/sodium-hydroxide.pdf', lastUpdated: new Date('2024-02-01') },
        hazards: ['corrosive'],
        precautionaryMeasures: ['Wear chemical-resistant gloves'],
        emergencyProcedures: { spill: 'Sweep up and place in container', fire: 'Use water spray', exposure: 'Flush with water', firstAid: 'Seek medical attention' },
        ppeRequired: ['gloves', 'goggles'],
        disposalMethod: 'hazardous-waste',
        responsiblePerson: testUser._id,
        notes: 'Avoid contact with skin.'
      },
      {
        name: 'Acetone',
        chemicalName: 'Acetone',
        casNumber: '67-64-1',
        manufacturer: 'SolventPro Inc',
        supplier: { name: 'Chemical Solutions', contact: '555-555-5555', email: 'contact@chemsol.com' },
        category: 'solvent',
        hazardClass: '3',
        physicalState: 'liquid',
        concentration: { value: 99.5, unit: '%' },
        quantity: { amount: 100, unit: 'L' },
        location: 'Flammable Storage Cabinet',
        storageConditions: { temperature: { min: 5, max: 25, unit: '°C' }, humidity: { min: 10, max: 60, unit: '%' }, specialRequirements: ['Keep away from heat'] },
        purchaseDate: new Date('2024-03-01'),
        expiryDate: new Date('2025-09-15'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        status: 'active',
        safetyDataSheet: { available: true, url: 'https://example.com/msds/acetone.pdf', lastUpdated: new Date('2024-03-01') },
        hazards: ['flammable'],
        precautionaryMeasures: ['Use in well-ventilated area'],
        emergencyProcedures: { spill: 'Absorb with sand', fire: 'Use foam or CO2', exposure: 'Move to fresh air', firstAid: 'Seek medical attention' },
        ppeRequired: ['gloves', 'goggles', 'lab-coat'],
        disposalMethod: 'incineration',
        responsiblePerson: testUser._id,
        notes: 'Highly flammable.'
      }
    ];
    
    for (const chemical of chemicalProducts) {
      const newChemical = new ChemicalProduct(chemical);
      await newChemical.save();
    }
    
    console.log('Creating occupational diseases...');
    const diseases = [
      {
        name: 'Silicosis',
        description: 'A lung disease caused by inhaling silica dust.',
        symptoms: ['Shortness of breath', 'Cough', 'Chest pain', 'Fatigue'],
        riskFactors: ['Mining', 'Construction', 'Sandblasting'],
        prevention: ['Use proper respiratory protection', 'Wet cutting methods'],
        treatment: ['No cure, supportive care'],
        riskSector: 'Construction',
        severity: 'high',
        icd10Code: 'J62',
        reportedBy: testUser._id,
        reportedDate: new Date('2024-01-15'),
        status: 'active',
        notes: 'Monitor workers regularly.'
      },
      {
        name: 'Carpal Tunnel Syndrome',
        description: 'A condition caused by pressure on the median nerve in the wrist.',
        symptoms: ['Numbness', 'Tingling', 'Pain in hands and wrists'],
        riskFactors: ['Computer work', 'Assembly line work', 'Typing'],
        prevention: ['Proper ergonomics', 'Regular breaks', 'Wrist exercises'],
        treatment: ['Splinting', 'Surgery'],
        riskSector: 'Manufacturing',
        severity: 'medium',
        icd10Code: 'G56.0',
        reportedBy: testUser._id,
        reportedDate: new Date('2024-02-20'),
        status: 'active',
        notes: 'Encourage ergonomic assessments.'
      },
      {
        name: 'Chemical Burn',
        description: 'Skin injury caused by exposure to corrosive chemicals.',
        symptoms: ['Skin irritation', 'Burns', 'Blisters'],
        riskFactors: ['Chemical handling', 'Laboratory work'],
        prevention: ['Proper PPE', 'Chemical safety training'],
        treatment: ['Immediate washing', 'Medical care'],
        riskSector: 'Laboratory',
        severity: 'high',
        icd10Code: 'T23',
        reportedBy: testUser._id,
        reportedDate: new Date('2024-03-10'),
        status: 'resolved',
        notes: 'Ensure eyewash stations are available.'
      }
    ];
    
    for (const disease of diseases) {
      const newDisease = new Disease(disease);
      await newDisease.save();
    }
    
    console.log('Creating PPE items...');
    const ppeItems = [
      {
        name: 'Safety Glasses',
        category: 'eye',
        description: 'Protects eyes from chemical splashes.',
        manufacturer: 'SafetyVision Inc',
        model: 'SV-2000',
        serialNumber: 'PPE-EYE-001',
        purchaseDate: new Date('2024-01-01'),
        expiryDate: new Date('2025-01-01'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        condition: 'good',
        status: 'available',
        assignedTo: testUser._id,
        assignedDate: new Date('2024-01-02'),
        location: 'PPE Storage Room',
        quantity: 10,
        unit: 'piece',
        cost: 50,
        supplier: { name: 'PPE Supplier', contact: '111-222-3333', email: 'ppe@supplier.com' },
        specifications: { material: 'Polycarbonate', size: 'Universal', color: 'Clear', weight: '50g', certifications: ['ANSI Z87.1'] },
        notes: 'Replace if scratched.'
      },
      {
        name: 'Chemical-Resistant Gloves',
        category: 'hand',
        description: 'Protects hands from hazardous chemicals.',
        manufacturer: 'HandSafe Corp',
        model: 'CR-500',
        serialNumber: 'PPE-HAND-001',
        purchaseDate: new Date('2024-02-01'),
        expiryDate: new Date('2025-02-01'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        condition: 'good',
        status: 'available',
        assignedTo: testUser._id,
        assignedDate: new Date('2024-02-02'),
        location: 'Chemical Lab',
        quantity: 20,
        unit: 'pair',
        cost: 30,
        supplier: { name: 'Glove Supplier', contact: '444-555-6666', email: 'glove@supplier.com' },
        specifications: { material: 'Nitrile', size: 'Large', color: 'Blue', weight: '100g', certifications: ['EN 374'] },
        notes: 'Inspect before each use.'
      },
      {
        name: 'N95 Respirator',
        category: 'respiratory',
        description: 'Protects against airborne particles.',
        manufacturer: 'RespirSafe Ltd',
        model: 'N95-2000',
        serialNumber: 'PPE-RESP-001',
        purchaseDate: new Date('2024-03-01'),
        expiryDate: new Date('2025-03-01'),
        lastInspection: new Date('2024-06-01'),
        nextInspection: new Date('2024-12-01'),
        condition: 'good',
        status: 'available',
        assignedTo: testUser._id,
        assignedDate: new Date('2024-03-02'),
        location: 'Respiratory Protection Cabinet',
        quantity: 15,
        unit: 'piece',
        cost: 20,
        supplier: { name: 'Mask Supplier', contact: '777-888-9999', email: 'mask@supplier.com' },
        specifications: { material: 'Non-woven', size: 'Standard', color: 'White', weight: '30g', certifications: ['NIOSH N95'] },
        notes: 'Single use only.'
      }
    ];
    
    for (const ppe of ppeItems) {
      const newPPE = new PPE(ppe);
      await newPPE.save();
    }
    
    console.log('Creating equipment...');
    const equipment = [
      {
        name: 'Fume Hood',
        type: 'Laboratory Equipment',
        model: 'FH-2000',
        serialNumber: 'EQ-LAB-001',
        manufacturer: 'LabSafe Inc',
        purchaseDate: new Date('2024-01-01'),
        warrantyExpiry: new Date('2027-01-01'),
        location: 'Chemistry Lab',
        status: 'functional',
        condition: 'good',
        lastMaintenance: new Date('2024-06-01'),
        nextMaintenance: new Date('2024-12-01'),
        assignedTo: testUser._id,
        assignedDate: new Date('2024-01-02'),
        cost: 5000,
        supplier: { name: 'Lab Supplier', contact: '222-333-4444', email: 'lab@supplier.com' },
        specifications: { power: '220V', dimensions: '2x1x1.5m', weight: '200kg', capacity: 'Large' },
        notes: 'Annual maintenance required.'
      },
      {
        name: 'Centrifuge',
        type: 'Laboratory Equipment',
        model: 'CT-5000',
        serialNumber: 'EQ-LAB-002',
        manufacturer: 'SpinTech Corp',
        purchaseDate: new Date('2024-02-01'),
        warrantyExpiry: new Date('2026-02-01'),
        location: 'Biology Lab',
        status: 'functional',
        condition: 'good',
        lastMaintenance: new Date('2024-06-01'),
        nextMaintenance: new Date('2024-12-01'),
        assignedTo: testUser._id,
        assignedDate: new Date('2024-02-02'),
        cost: 3000,
        supplier: { name: 'Bio Supplier', contact: '555-666-7777', email: 'bio@supplier.com' },
        specifications: { power: '110V', dimensions: '1x1x1m', weight: '100kg', capacity: 'Medium' },
        notes: 'Check rotor monthly.'
      },
      {
        name: 'Pompe anti incendie',
        type: 'Emergency Equipment',
        model: 'SS-1000',
        serialNumber: 'EQ-EMERG-001',
        manufacturer: 'EmergencySafe Ltd',
        purchaseDate: new Date('2024-03-01'),
        warrantyExpiry: new Date('2029-03-01'),
        location: 'Chemical Storage Area',
        status: 'functional',
        condition: 'good',
        lastMaintenance: new Date('2024-06-01'),
        nextMaintenance: new Date('2024-12-01'),
        assignedTo: testUser._id,
        assignedDate: new Date('2024-03-02'),
        cost: 1000,
        supplier: { name: 'Emerg Supplier', contact: '888-999-0000', email: 'emerg@supplier.com' },
        specifications: { power: 'None', dimensions: '2x2x2m', weight: '150kg', capacity: 'Single' },
        notes: 'Test monthly.'
      }
    ];
    
    for (const equip of equipment) {
      const newEquipment = new Equipment(equip);
      await newEquipment.save();
    }
    
    console.log('Creating accident records...');
    const accidents = [
      {
        title: 'Chemical Spill',
        description: 'Minor spill of sulfuric acid in laboratory',
        date: new Date('2024-02-15'),
        location: 'Chemistry Lab',
        severity: 'minor',
        type: 'chemical',
        status: 'resolved',
        reportedBy: testUser._id,
        assignedTo: testUser._id
      },
      {
        title: 'Slip and Fall',
        description: 'Employee slipped on wet floor in chemical storage area',
        date: new Date('2024-01-20'),
        location: 'Chemical Storage Room A',
        severity: 'moderate',
        type: 'slip',
        status: 'investigating',
        reportedBy: testUser._id,
        assignedTo: testUser._id
      }
    ];
    
    for (const accident of accidents) {
      const newAccident = new Accident(accident);
      await newAccident.save();
    }
    
    console.log('Creating appointments...');
    const appointments = [
      {
        userId: testUser._id,
        date: new Date('2024-04-15'),
        time: '10:00',
        type: 'medical-checkup',
        description: 'Annual occupational health examination',
        location: 'Clinic Room 1',
        status: 'scheduled',
        priority: 'medium',
        duration: 30
      },
      {
        userId: testUser._id,
        date: new Date('2024-04-20'),
        time: '14:30',
        type: 'consultation',
        description: 'Consultation with occupational health specialist',
        location: 'Clinic Room 2',
        status: 'scheduled',
        priority: 'high',
        duration: 45
      }
    ];
    
    for (const appointment of appointments) {
      const newAppointment = new Appointment(appointment);
      await newAppointment.save();
    }
    
    console.log('Database seeding completed successfully!');
    console.log('Sample data created:');
    console.log('  Users: 1');
    console.log('  Chemical Products: 3');
    console.log('  Diseases: 3');
    console.log('  PPE Items: 3');
    console.log('  Equipment: 3');
    console.log('  Accidents: 2');
    console.log('  Appointments: 2');
    console.log('');
    console.log('Test User Credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData(); 