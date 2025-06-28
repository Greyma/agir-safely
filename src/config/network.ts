// Network configuration for different environments
export const NETWORK_CONFIG = {
  // Production URL (Render deployment)
  production: {
    baseUrl: 'https://agir-safely-backend.onrender.com',
    timeout: 10000,
  },
  // Development URLs - modify these based on your setup
  development: {
    baseUrl: 'http://192.168.1.5:5000',
    timeout: 10000,
  },
  // Additional development URL
  development2: {
    baseUrl: 'http://192.168.1.7:5000',
    timeout: 10000,
  },
  // Android Emulator URL
  androidEmulator: {
    baseUrl: 'http://10.0.2.2:5000',
    timeout: 10000,
  },
  // Local development
  local: {
    baseUrl: 'http://localhost:5000',
    timeout: 10000,
  },
};

// Get the appropriate configuration based on environment
export const getNetworkConfig = () => {
  // Use development URL for both development and production (temporarily)
  return NETWORK_CONFIG.development;
};

// Helper function to test network connectivity
export const testNetworkConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${url}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Network test failed for URL:', url, error);
    return false;
  }
};

// Get the best available API URL
export const getBestApiUrl = async (): Promise<string> => {
  const urls = [
    NETWORK_CONFIG.production.baseUrl, // Try production first
    NETWORK_CONFIG.development.baseUrl,
    NETWORK_CONFIG.development2.baseUrl,
    NETWORK_CONFIG.androidEmulator.baseUrl,
    NETWORK_CONFIG.local.baseUrl,
  ];

  for (const url of urls) {
    const isAvailable = await testNetworkConnection(url);
    if (isAvailable) {
      console.log('Found working API URL:', url);
      return url;
    }
  }

  // Return production URL if none work
  console.warn('No working API URL found, using production');
  return NETWORK_CONFIG.production.baseUrl;
}; 