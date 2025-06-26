import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

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
  return (
    <Stack.Navigator>
      <Stack.Screen name="AccidentologyMain" component={AccidentologyScreen} options={{ title: "Accidentologies" }} />
      <Stack.Screen name="AddAccident" component={AddAccidentScreen} options={{ title: "Nouvel Accident" }} />
    </Stack.Navigator>
  )
}

function ChemicalStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChemicalMain" component={ChemicalProductsScreen} options={{ title: "Produits Chimiques" }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Fiche de Sécurité" }} />
    </Stack.Navigator>
  )
}

function DiseasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiseasesMain"
        component={OccupationalDiseasesScreen}
        options={{ title: "Maladies Professionnelles" }}
      />
      <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: "Prendre RDV" }} />
    </Stack.Navigator>
  )
}

function MaintenanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MaintenanceMain" component={MaintenanceScreen} options={{ title: "Maintenance" }} />
      <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} options={{ title: "Détail Équipement" }} />
    </Stack.Navigator>
  )
}

function PPEStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PPEMain" component={PPEScreen} options={{ title: "EPI" }} />
      <Stack.Screen name="PPEDetail" component={PPEDetailScreen} options={{ title: "Détail EPI" }} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
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

              return <Icon name={iconName} size={size} color={color} />
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
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
