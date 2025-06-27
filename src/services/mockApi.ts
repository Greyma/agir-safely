// Mock API for testing - replace with real API later
export const mockApiService = {
  async login(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'test@example.com' && password === 'password') {
      return {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          email: email,
          name: 'Test User'
        }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  async register(email: string, password: string, name: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration
    return {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: Date.now().toString(),
        email: email,
        name: name
      }
    };
  },

  async getProtectedData(endpoint: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock protected data
    return {
      message: 'Protected data from ' + endpoint,
      timestamp: new Date().toISOString()
    };
  }
}; 