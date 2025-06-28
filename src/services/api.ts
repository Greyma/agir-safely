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
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: 'Network error' };
        }
        // Throw the full error object so the frontend can access errorData.errors
        throw errorData;
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      if (error instanceof TypeError && error.message && error.message.includes('fetch')) {
        throw { message: 'Network connection failed. Please check your internet connection.' };
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

  // ===== PPE METHODS =====
  async getPPE() {
    return this.getProtectedData('/api/ppe');
  }

  async createPPE(ppeData: any) {
    return this.postProtectedData('/api/ppe', ppeData);
  }

  async getPPEById(id: string) {
    return this.getProtectedData(`/api/ppe/${id}`);
  }

  async updatePPE(id: string, ppeData: any) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/ppe/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(ppeData),
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

  async deletePPE(id: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/ppe/${id}`, {
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

  async reportPPEDamage(id: string, damageData: any) {
    return this.postProtectedData(`/api/ppe/${id}/damage`, damageData);
  }

  // ===== CHEMICAL PRODUCTS METHODS =====
  async getChemicalProducts() {
    return this.getProtectedData('/api/chemicals');
  }

  async createChemicalProduct(chemicalData: any) {
    return this.postProtectedData('/api/chemicals', chemicalData);
  }

  async getChemicalProductById(id: string) {
    return this.getProtectedData(`/api/chemicals/${id}`);
  }

  async updateChemicalProduct(id: string, chemicalData: any) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chemicals/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(chemicalData),
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

  async deleteChemicalProduct(id: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/chemicals/${id}`, {
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

  // ===== EQUIPMENT/MAINTENANCE METHODS =====
  async getEquipment() {
    return this.getProtectedData('/api/equipment');
  }

  async createEquipment(equipmentData: any) {
    return this.postProtectedData('/api/equipment', equipmentData);
  }

  async getEquipmentById(id: string) {
    return this.getProtectedData(`/api/equipment/${id}`);
  }

  async updateEquipmentStatus(id: string, status: string) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/equipment/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
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

  async scheduleMaintenance(id: string, maintenanceData: any) {
    return this.postProtectedData(`/api/equipment/${id}/maintenance`, maintenanceData);
  }

  // ===== DISEASES METHODS =====
  async getDiseases() {
    return this.getProtectedData('/api/diseases');
  }

  async createDisease(diseaseData: any) {
    return this.postProtectedData('/api/diseases', diseaseData);
  }

  // ===== APPOINTMENTS METHODS =====
  async getAppointments() {
    return this.getProtectedData('/api/appointments');
  }

  async scheduleAppointment(appointmentData: any) {
    return this.postProtectedData('/api/appointments', appointmentData);
  }
}

export const apiService = new ApiService(); 