"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { apiService } from "../services/api"

export default function AddAccidentScreen({ navigation }: any) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [severity, setSeverity] = useState<"minor" | "moderate" | "severe" | "critical">("minor")
  const [type, setType] = useState<"slip" | "fall" | "cut" | "burn" | "chemical" | "electrical" | "mechanical" | "other">("other")
  const [loading, setLoading] = useState(false)

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "minor":
        return "Faible"
      case "moderate":
        return "Moyenne"
      case "severe":
        return "Élevée"
      case "critical":
        return "Critique"
      default:
        return severity
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "slip":
        return "Glissade"
      case "fall":
        return "Chute"
      case "cut":
        return "Coupure"
      case "burn":
        return "Brûlure"
      case "chemical":
        return "Chimique"
      case "electrical":
        return "Électrique"
      case "mechanical":
        return "Mécanique"
      case "other":
        return "Autre"
      default:
        return type
    }
  }

  const handleSubmit = async () => {
    if (!title || !description || !location || !date) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      
      const accidentData = {
        title,
        description,
        location,
        date: new Date(date).toISOString(),
        severity,
        type,
        status: 'reported'
      }

      await apiService.createAccident(accidentData)
      
      Alert.alert("Succès", "L'accident a été enregistré avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (error) {
      console.error('Error creating accident:', error)
      Alert.alert("Erreur", "Impossible d'enregistrer l'accident. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de l'accident"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez l'accident en détail..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Lieu *</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ex: Atelier A - Zone de découpe"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date *</Text>
          <TextInput 
            style={styles.input} 
            value={date} 
            onChangeText={setDate} 
            placeholder="YYYY-MM-DD" 
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gravité</Text>
          <View style={styles.gravityContainer}>
            {(["minor", "moderate", "severe", "critical"] as const).map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.gravityButton, severity === level && styles.gravityButtonActive]}
                onPress={() => setSeverity(level)}
              >
                <Text style={[styles.gravityButtonText, severity === level && styles.gravityButtonTextActive]}>
                  {getSeverityText(level)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type d'accident</Text>
          <View style={styles.typeContainer}>
            {(["slip", "fall", "cut", "burn", "chemical", "electrical", "mechanical", "other"] as const).map((accidentType) => (
              <TouchableOpacity
                key={accidentType}
                style={[styles.typeButton, type === accidentType && styles.typeButtonActive]}
                onPress={() => setType(accidentType)}
              >
                <Text style={[styles.typeButtonText, type === accidentType && styles.typeButtonTextActive]}>
                  {getTypeText(accidentType)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer l'accident</Text>
          )}
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
    color: "#1e293b",
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
    color: "#1e293b",
  },
  gravityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gravityButton: {
    flex: 1,
    minWidth: "45%",
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
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#e2e8f0",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  typeButtonTextActive: {
    color: "white",
  },
})
