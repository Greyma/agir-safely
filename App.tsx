import React from 'react';
import { StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { QuestionsProvider } from './src/contexts/QuestionsContext';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import AccidentologyScreen from './src/screens/AccidentologyScreen';
import ChemicalProductsScreen from './src/screens/ChemicalProductsScreen';
import OccupationalDiseasesScreen from './src/screens/OccupationalDiseasesScreen';
import MaintenanceScreen from './src/screens/MaintenanceScreen';
import PPEScreen from './src/screens/PPEScreen';
import DiseaseTestScreen from './src/screens/DiseaseTestScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import AddAccidentScreen from './src/screens/AddAccidentScreen';
import PdfViewerScreen from './src/screens/PdfViewerScreen';
import BoxQuestionScreen from './src/screens/BoxQuestionScreen';
import QuestionResponsesScreen from './src/screens/QuestionResponsesScreen';
import LoginScreen from './src/screens/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Tabs: undefined;
  PdfViewer: { pdfUrl: string; title: string };
  DiseaseTest: { disease: any };
  Appointment: undefined;
  AddAccident: undefined;
  QuestionResponses: { questionId: string };
  BoxQuestion: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function QuestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BoxQuestion" component={BoxQuestionScreen} />
      <Stack.Screen name="QuestionResponses" component={QuestionResponsesScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Accidents"
        component={AccidentologyScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="warning" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Chimiques"
        component={ChemicalProductsScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="science" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Maladies"
        component={OccupationalDiseasesScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="healing" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="build" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="EPI"
        component={PPEScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="security" color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Questions"
        component={QuestionsStack}
        options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="help" color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a splash / loader
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
          <Stack.Screen name="DiseaseTest" component={DiseaseTestScreen} />
          <Stack.Screen name="Appointment" component={AppointmentScreen} />
          <Stack.Screen name="AddAccident" component={AddAccidentScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <QuestionsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QuestionsProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 15,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    margin: 15,
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f1f5f9',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendText: {
    color: '#fff',
    marginLeft: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  cardMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  previewReply: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 4,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
