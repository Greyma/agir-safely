import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const delaiMap: { [key: string]: string } = {
  "Polynévrite (N-Hexane)": "30 jours",
  "Inflammations Cutanées (Chromates)": "60 jours",
  "Maladies Respiratoires (Chromates)": "30 jours",
  "Cancers liés aux Chromates": "360 mois (30 ans)",
  "Encéphalopathie aiguë": "30 jours",
  "Anémie (Plomb)": "12 mois",
  "Néphropathie (Atteinte rénale due au Plomb)": "60 mois (5 ans)",
}

function getDelai(name: string) {
  return delaiMap[name] || "—"
}

export default function DiseaseTestScreen({ route, navigation }: any) {
  const { disease } = route.params;
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSymptom = (idx: number) => {
    setSelected(selected.includes(idx)
      ? selected.filter(i => i !== idx)
      : [...selected, idx]);
  };

  const handleSubmit = () => {
    // You can calculate score here if needed
    Alert.alert(
      "Test envoyé",
      "Votre test a été envoyé. Vous pouvez réserver un rendez-vous.",
      [
        { text: "OK", onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TEST</Text>
      <Text style={styles.subtitle}>{disease.name}</Text>
      <ScrollView style={styles.symptomList}>
        {disease.symptoms.map((s: any, idx: number) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.symptomItem,
              selected.includes(idx) && styles.symptomItemSelected
            ]}
            onPress={() => toggleSymptom(idx)}
          >
            <View style={styles.checkbox}>
              {selected.includes(idx) && <View style={styles.checked} />}
            </View>
            <Text style={styles.symptomText}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 15,
          fontWeight: "600",
          color: "#1e293b",
          marginBottom: 4
        }}>
          Délai de prise en charge
        </Text>
        <Text style={{
          fontSize: 14,
          color: "#475569",
        }}>
          · {getDelai(disease.name)}
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Envoyer / Réserver un rendez-vous</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 16 },
  symptomList: { marginBottom: 24 },
  symptomItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  symptomItemSelected: {
    borderColor: "#2563eb",
    backgroundColor: "#dbeafe"
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2,
    borderColor: "#2563eb", marginRight: 12, justifyContent: "center", alignItems: "center"
  },
  checked: {
    width: 14, height: 14, borderRadius: 3, backgroundColor: "#2563eb"
  },
  symptomText: { 
    fontSize: 16, 
    color: "#1e293b", 
    flex: 1, 
    flexWrap: "wrap" 
  },
  submitButton: {
    backgroundColor: "#2563eb", padding: 16, borderRadius: 10, alignItems: "center"
  },
  submitButtonText: { color: "white", fontSize: 18, fontWeight: "bold" }
});