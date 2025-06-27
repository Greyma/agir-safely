import bcrypt from 'bcryptjs';

async function createHash() {
  try {
    const password = 'test12345';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password:', password);
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error:', error);
  }
}

createHash(); 