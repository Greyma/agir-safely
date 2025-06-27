import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { apiService } from '../services/api';
import { getNetworkConfig, testNetworkConnection } from '../config/network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugScreen: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const collectDebugInfo = async () => {
    setIsLoading(true);
    try {
      const info: any = {};

      // Network configuration
      info.networkConfig = getNetworkConfig();
      info.currentApiUrl = apiService.getCurrentApiUrl();

      // Test network connections
      const urls = [
        'http://192.168.1.7:5000',
        'http://10.0.2.2:5000',
        'http://localhost:5000',
      ];

      info.networkTests = {};
      for (const url of urls) {
        info.networkTests[url] = await testNetworkConnection(url);
      }

      // Storage info
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const user = await AsyncStorage.getItem('user');
        info.storage = {
          hasAuthToken: !!authToken,
          hasUser: !!user,
          tokenLength: authToken?.length || 0,
        };
      } catch (error) {
        info.storage = { error: (error as Error).message };
      }

      // API test
      try {
        info.apiTest = await apiService.testConnection();
      } catch (error) {
        info.apiTest = { error: (error as Error).message };
      }

      setDebugInfo(info);
    } catch (error) {
      Alert.alert('Error', 'Failed to collect debug info: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'Storage cleared');
      collectDebugInfo();
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    collectDebugInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug Information</Text>
      
      <TouchableOpacity style={styles.button} onPress={collectDebugInfo}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Collecting...' : 'Refresh Debug Info'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearStorage}>
        <Text style={styles.buttonText}>Clear Storage</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Configuration</Text>
        <Text style={styles.info}>Current API URL: {debugInfo.currentApiUrl}</Text>
        <Text style={styles.info}>Config Base URL: {debugInfo.networkConfig?.baseUrl}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Tests</Text>
        {debugInfo.networkTests && Object.entries(debugInfo.networkTests).map(([url, status]) => (
          <Text key={url} style={[styles.info, status ? styles.success : styles.error]}>
            {url}: {status ? '✅ Working' : '❌ Failed'}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Status</Text>
        {debugInfo.storage && (
          <>
            <Text style={styles.info}>Auth Token: {debugInfo.storage.hasAuthToken ? '✅ Present' : '❌ Missing'}</Text>
            <Text style={styles.info}>User Data: {debugInfo.storage.hasUser ? '✅ Present' : '❌ Missing'}</Text>
            {debugInfo.storage.tokenLength > 0 && (
              <Text style={styles.info}>Token Length: {debugInfo.storage.tokenLength}</Text>
            )}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Connection Test</Text>
        <Text style={[styles.info, debugInfo.apiTest ? styles.success : styles.error]}>
          API Connection: {debugInfo.apiTest ? '✅ Working' : '❌ Failed'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  success: {
    color: '#059669',
  },
  error: {
    color: '#dc2626',
  },
});

export default DebugScreen; 