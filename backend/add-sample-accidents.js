import connectDB from './config/database.js';
import Accident from './models/Accident.js';
import User from './models/User.js';

async function addSampleAccidents() {
  console.log('🔧 Adding sample accidents to database...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get the test user
    const testUser = await User.findOne({ email: 'test@agirsafely.com' });
    if (!testUser) {
      console.log('❌ Test user not found. Please run add-test-user.js first.');
      return;
    }

    // Check if accidents already exist
    const existingAccidents = await Accident.find();
    if (existingAccidents.length > 0) {
      console.log('⚠️  Sample accidents already exist in database');
      return;
    }

    // Sample accident data
    const sampleAccidents = [
      {
        title: "Coupure mineure à la main droite",
        description: "Coupure mineure à la main droite lors de la manipulation d'une pièce métallique dans la zone de découpe. L'employé portait des gants mais ils étaient usés.",
        date: new Date('2024-01-15'),
        location: "Atelier A - Zone de découpe",
        severity: "minor",
        type: "cut",
        status: "reported",
        reportedBy: testUser._id,
        immediateActions: ["Premiers soins appliqués", "Zone sécurisée"],
        rootCause: "Gants de protection usés",
        preventiveMeasures: ["Remplacer les gants régulièrement", "Formation sur l'utilisation des EPI"]
      },
      {
        title: "Chute de cartons depuis une étagère",
        description: "Chute de cartons depuis une étagère haute dans l'entrepôt. L'employé a reçu une contusion à l'épaule droite.",
        date: new Date('2024-01-10'),
        location: "Entrepôt B - Allée 3",
        severity: "moderate",
        type: "fall",
        status: "investigating",
        reportedBy: testUser._id,
        immediateActions: ["Évacuation vers l'infirmerie", "Zone fermée temporairement"],
        rootCause: "Empilement instable des cartons",
        preventiveMeasures: ["Formation sur l'empilement sécurisé", "Inspection régulière des étagères"]
      },
      {
        title: "Projection de liquide chimique",
        description: "Projection de liquide chimique lors du transfert d'un réactif. Brûlure légère au bras gauche de l'opérateur.",
        date: new Date('2024-01-05'),
        location: "Zone de production - Ligne 2",
        severity: "moderate",
        type: "chemical",
        status: "resolved",
        reportedBy: testUser._id,
        immediateActions: ["Rinçage immédiat à l'eau", "Évacuation médicale"],
        rootCause: "Procédure de transfert non respectée",
        preventiveMeasures: ["Révision des procédures", "Formation renforcée", "Équipement de protection supplémentaire"]
      },
      {
        title: "Glissade sur sol mouillé",
        description: "Glissade sur sol mouillé dans les sanitaires. L'employé a eu une entorse à la cheville.",
        date: new Date('2024-01-20'),
        location: "Sanitaires - Bâtiment principal",
        severity: "minor",
        type: "slip",
        status: "reported",
        reportedBy: testUser._id,
        immediateActions: ["Premiers soins", "Signalisation de la zone"],
        rootCause: "Sol non séché après nettoyage",
        preventiveMeasures: ["Panneaux d'avertissement", "Procédure de séchage améliorée"]
      }
    ];

    // Create accidents
    for (const accidentData of sampleAccidents) {
      const accident = new Accident(accidentData);
      await accident.save();
      console.log(`✅ Created accident: ${accident.title}`);
    }

    console.log(`\n🎉 Successfully created ${sampleAccidents.length} sample accidents!`);

  } catch (error) {
    console.error('❌ Error creating sample accidents:', error.message);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the script
addSampleAccidents(); 