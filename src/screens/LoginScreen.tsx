import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { clearStoredAuth } from '../utils/clearAuth';

const BRAND_COLOR = '#2563eb';
const MIN_PASSWORD_LENGTH = 6;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cardAnim] = useState(new Animated.Value(0));
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { login, register, isLoading, resetAuth } = useAuth();

  React.useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, []);

  React.useEffect(() => {
    if (!isLogin && password.length > 0 && password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    } else {
      setPasswordError(null);
    }
  }, [password, isLogin]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!isLogin && password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert('Error', `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    try {
      let success;
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          Alert.alert('Error', 'Login failed');
        }
      } else {
        const result = await register(email, password, name);
        if (!result.success) {
          Alert.alert('Registration Error', result.error || 'Registration failed');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleClearAuth = async () => {
    try {
      await clearStoredAuth();
      await resetAuth();
      Alert.alert('Success', 'Authentication data cleared. You can now log in with the test credentials:\n\nEmail: test@example.com\nPassword: password123');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear authentication data');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={[styles.card, { opacity: cardAnim, transform: [{ scale: cardAnim }] }]}>  
        <Text style={styles.logo}>Agir Safely</Text>
        <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#aaa"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((v) => !v)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={showPassword ? BRAND_COLOR : '#aaa'}
            />
          </TouchableOpacity>
        </View>
        {(!isLogin && passwordError) && (
          <Text style={styles.passwordError}>{passwordError}</Text>
        )}
        <TouchableOpacity style={[styles.button, (!isLogin && !!passwordError) && styles.buttonDisabled]} onPress={handleSubmit} disabled={isLoading || (!isLogin && !!passwordError)}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
        
        {/* Debug button to clear auth data */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleClearAuth}
        >
          <Text style={styles.debugButtonText}>Clear Auth Data (Debug)</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND_COLOR,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
  },
  input: {
    backgroundColor: '#f7f8fa',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#222',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeButton: {
    padding: 8,
    marginLeft: -36,
    zIndex: 1,
  },
  button: {
    backgroundColor: BRAND_COLOR,
    padding: 15,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: BRAND_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchButton: {
    marginTop: 8,
    padding: 10,
  },
  switchText: {
    color: BRAND_COLOR,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  passwordError: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  debugButton: {
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  debugButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default LoginScreen; 