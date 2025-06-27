import connectDB from './config/database.js';
import User from './models/User.js';

async function addTestUser() {
  console.log('🔧 Adding test user to database...\n');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@agirsafely.com' });
    
    if (existingUser) {
      console.log('⚠️  Test user already exists:');
      console.log('   Email:', existingUser.email);
      console.log('   Name:', existingUser.name);
      console.log('   Password: test123456');
      return;
    }

    // Create new test user
    const testUser = new User({
      email: 'test@agirsafely.com',
      password: 'test123456',
      name: 'Test User',
      role: 'user',
      department: 'Safety',
      phone: '+1234567890'
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('   Email: test@agirsafely.com');
    console.log('   Password: test123456');
    console.log('   Name: Test User');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run the script
addTestUser(); 