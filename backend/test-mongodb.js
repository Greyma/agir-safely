import connectDB from './config/database.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();
console.log('ALL ENV:', process.env);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const testMongoDB = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    // Connect to database
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a user
    console.log('\n👤 Testing user creation...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@mongodb.com',
      password: 'testpassword123',
      role: 'user'
    });
    
    await testUser.save();
    console.log('✅ User created successfully!');
    
    // Test finding the user
    console.log('\n🔍 Testing user retrieval...');
    const foundUser = await User.findOne({ email: 'test@mongodb.com' });
    if (foundUser) {
      console.log('✅ User found:', foundUser.name);
    } else {
      console.log('❌ User not found');
    }
    
    // Test password comparison
    console.log('\n🔐 Testing password comparison...');
    const isValidPassword = await foundUser.comparePassword('testpassword123');
    console.log('✅ Password comparison result:', isValidPassword);
    
    // Clean up - delete test user
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@mongodb.com' });
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All MongoDB tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    process.exit(1);
  }
};

testMongoDB(); 