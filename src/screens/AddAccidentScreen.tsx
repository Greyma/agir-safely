"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

export default function AddAccidentScreen({ navigation }: any) {
  const [description, setDescription] = useState("")
  const [lieu, setLieu] = useState("")
  const [date, setDate] = useState("")
  const [gravite, setGravite] = useState<"Faible" | "Moyenne" | "Élevée">("Faible")

  const handleSubmit = () => {
    if (!description || !lieu || !date) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    Alert.alert("Accident enregistré", "L'accident a été enregistré avec succès", [
      { text: "OK", onPress: () => navigation.goBack() },
    ])
  }

  const addPhoto = () => {
    Alert.alert("Photo", "Fonctionnalité d'ajout de photo en développement")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez l'accident en détail..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Lieu *</Text>
          <TextInput
            style={styles.input}
            value={lieu}
            onChangeText={setLieu}
            placeholder="Ex: Atelier A - Zone de découpe"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date *</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gravité</Text>
          <View style={styles.gravityContainer}>
            {(["Faible", "Moyenne", "Élevée"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.gravityButton, gravite === level && styles.gravityButtonActive]}
                onPress={() => setGravite(level)}
              >
                <Text style={[styles.gravityButtonText, gravite === level && styles.gravityButtonTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Photo (optionnel)</Text>
          <TouchableOpacity style={styles.photoButton} onPress={addPhoto}>
            <Icon name="camera-alt" size={24} color="#64748b" />
            <Text style={styles.photoButtonText}>Ajouter une photo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enregistrer l'accident</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  gravityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  gravityButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  gravityButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  gravityButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  gravityButtonTextActive: {
    color: "white",
  },
  photoButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    color: "#64748b",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
