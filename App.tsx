import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import type { ParamListBase, RouteProp } from '@react-navigation/native'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import LoginScreen from './src/screens/LoginScreen'
import React from 'react'

// Import screens
import AccidentologyScreen from "./src/screens/AccidentologyScreen"
import ChemicalProductsScreen from "./src/screens/ChemicalProductsScreen"
import OccupationalDiseasesScreen from "./src/screens/OccupationalDiseasesScreen"
import MaintenanceScreen from "./src/screens/MaintenanceScreen"
import PPEScreen from "./src/screens/PPEScreen"
import AddAccidentScreen from "./src/screens/AddAccidentScreen"
import ProductDetailScreen from "./src/screens/ProductDetailScreen"
import AppointmentScreen from "./src/screens/AppointmentScreen"
import EquipmentDetailScreen from "./src/screens/EquipmentDetailScreen"
import PPEDetailScreen from "./src/screens/PPEDetailScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Loading Screen Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            Please restart the app or contact support if the problem persists.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Stack navigators for each tab
function AccidentologyStack() {
  const { logout, user } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AccidentologyMain" 
        component={AccidentologyScreen} 
        options={{ 
          title: "Accidentologies",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#2563eb" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="AddAccident" component={AddAccidentScreen} options={{ title: "Nouvel Accident" }} />
    </Stack.Navigator>
  )
}

function ChemicalStack() {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChemicalMain" 
        component={ChemicalProductsScreen} 
        options={{ 
          title: "Produits Chimiques",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#2563eb" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Fiche de Sécurité" }} />
    </Stack.Navigator>
  )
}

function DiseasesStack() {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiseasesMain"
        component={OccupationalDiseasesScreen}
        options={{ 
          title: "Maladies Professionnelles",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#2563eb" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: "Prendre RDV" }} />
    </Stack.Navigator>
  )
}

function MaintenanceStack() {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MaintenanceMain" 
        component={MaintenanceScreen} 
        options={{ 
          title: "Maintenance",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#2563eb" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} options={{ title: "Détail Équipement" }} />
    </Stack.Navigator>
  )
}

function PPEStack() {
  const { logout } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PPEMain" 
        component={PPEScreen} 
        options={{ 
          title: "EPI",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={24} color="#2563eb" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="PPEDetail" component={PPEDetailScreen} options={{ title: "Détail EPI" }} />
    </Stack.Navigator>
  )
}

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
            tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
              let iconName

              if (route.name === "Accidents") {
                iconName = "warning"
              } else if (route.name === "Chimiques") {
                iconName = "science"
              } else if (route.name === "Maladies") {
                iconName = "local-hospital"
              } else if (route.name === "Maintenance") {
                iconName = "build"
              } else if (route.name === "EPI") {
                iconName = "security"
              }

              return <MaterialIcons name={iconName as any || "help"} size={size} color={color} />
            },
            tabBarActiveTintColor: "#2563eb",
            tabBarInactiveTintColor: "gray",
            headerShown: false, // Headers are shown in individual stacks
          })}
        >
          <Tab.Screen name="Accidents" component={AccidentologyStack} />
          <Tab.Screen name="Chimiques" component={ChemicalStack} />
          <Tab.Screen name="Maladies" component={DiseasesStack} />
          <Tab.Screen name="Maintenance" component={MaintenanceStack} />
          <Tab.Screen name="EPI" component={PPEStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    padding: 5,
  },
  logoutText: {
    color: '#2563eb',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#2563eb',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: '#6b7280',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </AuthProvider>
  );
}
