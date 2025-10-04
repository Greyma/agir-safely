import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import type { ParamListBase, RouteProp } from "@react-navigation/native";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";

// Import screens
import AccidentologyScreen from "./src/screens/AccidentologyScreen";
import ChemicalProductsScreen from "./src/screens/ChemicalProductsScreen";
import OccupationalDiseasesScreen from "./src/screens/OccupationalDiseasesScreen";
import MaintenanceScreen from "./src/screens/MaintenanceScreen";
import PPEScreen from "./src/screens/PPEScreen";
import AddAccidentScreen from "./src/screens/AddAccidentScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import AppointmentScreen from "./src/screens/AppointmentScreen";
import EquipmentDetailScreen from "./src/screens/EquipmentDetailScreen";
import PPEDetailScreen from "./src/screens/PPEDetailScreen";
import PdfViewerScreen from "./src/screens/PdfViewerScreen";
import HomeScreen from "./src/screens/HomeScreen";

// --- Define your navigation types here ---
export type RootStackParamList = {
  ChemicalMain: undefined;
  ProductDetail: { productId: string }; // Example param
  PdfViewer: { pdfUrl: string; title: string };
  AccidentologyMain: undefined;
  AddAccident: undefined;
  DiseasesMain: undefined;
  Appointment: undefined;
  MaintenanceMain: undefined;
  EquipmentDetail: { equipmentId: string }; // Example param
  PPEMain: undefined;
  PPEDetail: { ppeId: string }; // Example param
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
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
  const { logout } = useAuth();

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
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AddAccident"
        component={AddAccidentScreen}
        options={{ title: "Nouvel Accident" }}
      />
    </Stack.Navigator>
  );
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
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Fiche de Sécurité" }}
      />
      <Stack.Screen
        name="PdfViewer"
        component={PdfViewerScreen}
        options={{ title: "Visualiser PDF" }}
      />
    </Stack.Navigator>
  );
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
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="DiseaseTest"
        component={require("./src/screens/DiseaseTestScreen").default}
        options={{ title: "Test Maladie" }}
      />
      <Stack.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{ title: "Prendre RDV" }}
      />
    </Stack.Navigator>
  );
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
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="EquipmentDetail"
        component={EquipmentDetailScreen}
        options={{ title: "Détail Équipement" }}
      />
      {/* Added so Maintenance can open the PDF viewer */}
      <Stack.Screen
        name="PdfViewer"
        component={PdfViewerScreen}
        options={{ title: "Programme de maintenance" }}
      />
    </Stack.Navigator>
  );
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
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="PPEDetail"
        component={PPEDetailScreen}
        options={{ title: "Détail EPI" }}
      />
    </Stack.Navigator>
  );
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

// TabNavigator is your existing Tab.Navigator with all tabs (Accidents, Chimiques, etc.)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<ParamListBase, string> }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName;

          if (route.name === "Accidents") {
            iconName = "warning";
          } else if (route.name === "Chimiques") {
            iconName = "science";
          } else if (route.name === "Maladies") {
            iconName = "local-hospital";
          } else if (route.name === "Maintenance") {
            iconName = "build";
          } else if (route.name === "EPI") {
            iconName = "security";
          }

          return <MaterialIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accidents" component={AccidentologyStack} />
      <Tab.Screen name="Chimiques" component={ChemicalStack} />
      <Tab.Screen name="Maladies" component={DiseasesStack} />
      <Tab.Screen name="Maintenance" component={MaintenanceStack} />
      <Tab.Screen name="EPI" component={PPEStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    padding: 5,
  },
  logoutText: {
    color: "#2563eb",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#2563eb",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    color: "#2563eb",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "#6b7280",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </ErrorBoundary>
    </AuthProvider>
  );
}
