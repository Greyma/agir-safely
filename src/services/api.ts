import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNetworkConfig, getBestApiUrl } from '../config/network';

// Get API base URL from configuration
let API_BASE_URL = getNetworkConfig().baseUrl;

// Initialize the best available API URL
const initializeApiUrl = async () => {
  try {
    API_BASE_URL = await getBestApiUrl();
    console.log('Initialized API URL:', API_BASE_URL);
  } catch (error) {
    console.error('Failed to initialize API URL:', error);
    // Keep the default URL
  }
};

// Initialize on module load
initializeApiUrl();

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest(url: string, options: RequestInit) {
    try {
      const response = await fetch(url, {
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    return this.makeRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.makeRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getProtectedData(endpoint: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async postProtectedData(endpoint: string, data: any) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const headers = await this.getAuthHeaders();
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getProfile() {
    return this.getProtectedData('/api/profile');
  }

  // Accident-related methods
  async getAccidents() {
    return this.getProtectedData('/api/accidents');
  }

  async createAccident(accidentData: any) {
    return this.postProtectedData('/api/accidents', accidentData);
  }

  async getAccidentById(id: string) {
    return this.getProtectedData(`/api/accidents/${id}`);
  }

  async updateAccident(id: string, accidentData: any) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/accidents/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(accidentData),
      });

      if (response.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  async deleteAccident(id: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/accidents/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.status === 401) {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Get current API URL for debugging
  getCurrentApiUrl() {
    return API_BASE_URL;
  }
}

export const apiService = new ApiService(); 