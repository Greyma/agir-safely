import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "Accidents" })}>
        <Text style={styles.buttonText}>Accidentologie</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "Chimiques" })}>
        <Text style={styles.buttonText}>Produits Chimiques</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "Maladies" })}>
        <Text style={styles.buttonText}>Maladies Professionnelles</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "Maintenance" })}>
        <Text style={styles.buttonText}>Maintenance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "EPI" })}>
        <Text style={styles.buttonText}>EPI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tabs", { screen: "Questions" })}>
        <Text style={styles.buttonText}>Box Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32, color: "#2563eb" },
  button: { backgroundColor: "#2563eb", padding: 18, borderRadius: 10, marginVertical: 10, width: 240, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
});