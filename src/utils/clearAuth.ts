import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearStoredAuth = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    console.log('✅ Stored authentication data cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
    return false;
  }
};

export const checkStoredAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const user = await AsyncStorage.getItem('user');
    console.log('🔍 Stored auth data:');
    console.log('  Token:', token ? 'Present' : 'None');
    console.log('  User:', user ? 'Present' : 'None');
    return { token: !!token, user: !!user };
  } catch (error) {
    console.error('❌ Error checking auth data:', error);
    return { token: false, user: false };
  }
}; 