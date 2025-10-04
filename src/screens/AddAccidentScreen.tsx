"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { apiService } from "../services/api"
import { MaterialIcons } from '@expo/vector-icons'; 

export default function AddAccidentScreen({ navigation }: any) {
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [severity, setSeverity] = useState<"minor" | "moderate" | "severe" | "critical">("minor")
  const [type, setType] = useState<"slip" | "fall" | "cut" | "burn" | "chemical" | "electrical" | "mechanical" | "other">("other")
  const [loading, setLoading] = useState(false)
  const [consequences, setConsequences] = useState("")
  const [causes, setCauses] = useState<string[]>([])
  const [causeInput, setCauseInput] = useState("")

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
    if (!description || !location || !date || !consequences || causes.length === 0) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)

      // Ensure ISO date string compatible with backend Date field
      const isoDate = new Date(date).toISOString()

      const title = description.trim().split(/\n|\./)[0]
        .slice(0, 80) || 'Accident'

      const accidentData = {
        title,
        description: `${description}\n\nConséquences humaines: ${consequences}\nCauses principales: ${causes.join(", ")}`,
        date: isoDate,
        location: location,
        severity: severity,
        type: type,
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
        {/* Replace Titre by Type d'accident at the top */}
        <View style={styles.section}>
          <Text style={styles.label}>Type d'accident *</Text>
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

        {/* Remove the Titre field */}
        {/* <View style={styles.section}>
          <Text style={styles.label}>Titre *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de l'accident"
            placeholderTextColor="#94a3b8"
          />
        </View> */}

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
          <Text style={styles.label}>Conséquences humaines *</Text>
          <TextInput
            style={styles.textArea}
            value={consequences}
            onChangeText={setConsequences}
            placeholder="Ex: 2 blessés, 1 décès, évacuation du site..."
            placeholderTextColor="#94a3b8"
            multiline
            
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Causes principales *</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={causeInput}
              onChangeText={setCauseInput}
              placeholder="Ajouter une cause principale"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              style={{
                marginLeft: 8,
                backgroundColor: "#2563eb",
                borderRadius: 8,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (causeInput.trim()) {
                  setCauses([...causes, causeInput.trim()])
                  setCauseInput("")
                }
              }}
            >
              <MaterialIcons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
          {causes.map((cause, idx) => (
            <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Text style={{ color: "#f59e0b", fontSize: 14 }}>• {cause}</Text>
              <TouchableOpacity onPress={() => setCauses(causes.filter((_, i) => i !== idx))}>
                <MaterialIcons name="close" size={16} color="#ef4444" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          ))}
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
  causesContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
  },
  causeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  causeInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  removeCauseButton: {
    marginLeft: 8,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 8,
  },
  removeCauseButtonText: {
    color: "white",
    fontWeight: "600",
  },
  addCauseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addCauseInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  addCauseButton: {
    marginLeft: 8,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 8,
  },
  addCauseButtonText: {
    color: "white",
    fontWeight: "600",
  },
})
