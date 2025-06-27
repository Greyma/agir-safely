import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkStoredData = async () => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    
    console.log('=== Stored Authentication Data ===');
    console.log('Auth Token:', authToken ? 'Present' : 'Not found');
    console.log('User Data:', user ? JSON.parse(user) : 'Not found');
    
    return { authToken, user: user ? JSON.parse(user) : null };
  } catch (error) {
    console.error('Error checking stored data:', error);
    return null;
  }
};

export const clearStoredData = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    console.log('Stored data cleared successfully');
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
}; 