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
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const { login, register, isLoading, resetAuth } = useAuth();

  React.useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, []);

  // Email validation
  React.useEffect(() => {
    if (email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Veuillez entrer une adresse email valide');
      } else {
        setEmailError(null);
      }
    } else {
      setEmailError(null);
    }
  }, [email]);

  // Password validation
  React.useEffect(() => {
    if (!isLogin && password.length > 0) {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setPasswordError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`);
      } else if (!/(?=.*[a-z])/.test(password)) {
        setPasswordError('Le mot de passe doit contenir au moins une lettre minuscule');
      } else if (!/(?=.*[A-Z])/.test(password)) {
        setPasswordError('Le mot de passe doit contenir au moins une lettre majuscule');
      } else if (!/(?=.*\d)/.test(password)) {
        setPasswordError('Le mot de passe doit contenir au moins un chiffre');
      } else {
        setPasswordError(null);
      }
    } else {
      setPasswordError(null);
    }
  }, [password, isLogin]);

  // Name validation
  React.useEffect(() => {
    if (!isLogin && name.length > 0) {
      if (name.length < 2) {
        setNameError('Le nom doit contenir au moins 2 caractères');
      } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
        setNameError('Le nom ne peut contenir que des lettres et des espaces');
      } else {
        setNameError(null);
      }
    } else {
      setNameError(null);
    }
  }, [name, isLogin]);

  // Clear auth error when switching modes
  React.useEffect(() => {
    setAuthError(null);
  }, [isLogin]);

  const validateForm = (): boolean => {
    if (!email || !password) {
      setAuthError('Veuillez remplir tous les champs requis');
      return false;
    }
    if (!isLogin && !name) {
      setAuthError('Veuillez entrer votre nom');
      return false;
    }
    if (emailError) {
      setAuthError('Veuillez corriger le format de l\'email');
      return false;
    }
    if (!isLogin && passwordError) {
      setAuthError('Veuillez corriger les exigences du mot de passe');
      return false;
    }
    if (!isLogin && nameError) {
      setAuthError('Veuillez corriger le format du nom');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setAuthError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register(email, password, name);
      }
      
      if (!result.success) {
        setAuthError(result.error || 'Échec de l\'authentification');
      }
    } catch (error) {
      setAuthError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    }
  };

  const hasErrors = !!(emailError || passwordError || nameError);
  const isFormValid = !hasErrors && email.length > 0 && password.length > 0 && (isLogin || name.length > 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND_COLOR} />
        <Text style={styles.loadingText}>Chargement...</Text>
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
        <Text style={styles.title}>{isLogin ? 'Bon Retour' : 'Créer un Compte'}</Text>
        
        {!isLogin && (
          <View>
            <TextInput
              style={[styles.input, nameError && styles.inputError]}
              placeholder="Nom Complet"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>
        )}
        
        <View>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
        
        <View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }, passwordError && styles.inputError]}
              placeholder="Mot de Passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((v) => !v)}
              accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={showPassword ? BRAND_COLOR : '#aaa'}
              />
            </TouchableOpacity>
          </View>
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        </View>

        {authError && (
          <View style={styles.authErrorContainer}>
            <Text style={styles.authErrorText}>{authError}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]} 
          onPress={handleSubmit} 
          disabled={isLoading || !isFormValid}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Se Connecter' : 'S\'inscrire'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Vous n'avez pas de compte ? S'inscrire"
              : 'Vous avez déjà un compte ? Se connecter'}
          </Text>
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
    marginBottom: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#222',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyeButton: {
    padding: 8,
    marginLeft: -36,
    zIndex: 1,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  authErrorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#dc2626',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  authErrorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
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
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
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
});

export default LoginScreen; 