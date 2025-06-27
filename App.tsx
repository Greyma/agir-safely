import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import type { ParamListBase, RouteProp } from '@react-navigation/native'
import { AuthProvider, useAuth } from './src/contexts/AuthContext'
import LoginScreen from './src/screens/LoginScreen'

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
    return null; // Or a loading screen
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
});

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
