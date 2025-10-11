"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { apiService } from "../services/api"
import { MaterialIcons } from '@expo/vector-icons'; 

export default function AddAccidentScreen({ navigation }: any) {
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [hour, setHour] = useState("") // <-- added
  const [type, setType] = useState<"slip" | "fall" | "cut" | "burn" | "chemical" | "electrical" | "mechanical" | "other">("other")
  const [loading, setLoading] = useState(false)
  const [consequences, setConsequences] = useState("")
  // Removed: severity, causes, causeInput

  const insets = useSafeAreaInsets()

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

  // Helpers: validate formats
  const isValidDate = (val: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false
    const [y, m, d] = val.split("-").map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d))
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
  }
  const isValidHour = (val: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val)

  const handleSubmit = async () => {
    // Update validation: remove severity/causes, require hour
    if (!description || !location || !date || !hour || !consequences) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }
    // Enforce formats
    if (!isValidDate(date)) {
      Alert.alert("Format invalide", "La date doit être au format YYYY-MM-DD")
      return
    }
    if (!isValidHour(hour)) {
      Alert.alert("Format invalide", "L'heure doit être au format HH:MM (24h)")
      return
    }

    try {
      setLoading(true)

      // Build ISO date-time from Date + Heure
      const isoDate = new Date(`${date}T${hour}`).toISOString()

      const title = description.trim().split(/\n|\./)[0].slice(0, 80) || 'Accident'

      // Default severity (backend requires it)
      const defaultSeverity: "minor" | "moderate" | "severe" | "critical" = "moderate"

      const accidentData = {
        title,
        // Remove "Causes principales"
        description: `${description}\n\nConséquences humaines: ${consequences}`,
        date: isoDate,
        location: location,
        severity: defaultSeverity,
        type: type,
        status: 'reported'
      }

      await apiService.createAccident(accidentData)

      Alert.alert("Succès", "L'accident a été signalé avec succès", [
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 90 }} // space for sticky footer
        >
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
              maxLength={10}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Heure *</Text>
            <TextInput
              style={styles.input}
              value={hour}
              onChangeText={setHour}
              placeholder="HH:MM"
              placeholderTextColor="#94a3b8"
              maxLength={5}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          {/* REMOVE Gravité section */}
          {/* 
          <View style={styles.section}>
            ...gravity buttons...
          </View>
          */}

          {/* Conséquences humaines (kept) */}
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

          {/* REMOVE Causes principales section */}
          {/*
          <View style={styles.section}>
            ...cause input & chips...
          </View>
          */}

          {/* REMOVE submit button from here (moved to sticky footer) */}
        </ScrollView>

        {/* Sticky footer with button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Signaler l'accident</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { flex: 1, padding: 20 },
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
  // NEW: footer bar
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
  },
})
