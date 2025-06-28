"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'

export default function AppointmentScreen({ navigation }: any) {
  const [nom, setNom] = useState("")
  const [motif, setMotif] = useState("")
  const [dateSouhaitee, setDateSouhaitee] = useState("")
  const [selectedMotif, setSelectedMotif] = useState("")

  const motifsRDV = [
    "Visite médicale périodique",
    "Visite de reprise",
    "Visite à la demande",
    "Suspicion maladie professionnelle",
    "Accident du travail",
    "Autre",
  ]

  const handleSubmit = () => {
    if (!nom || !selectedMotif || !dateSouhaitee) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    Alert.alert(
      "Rendez-vous demandé",
      "Votre demande de rendez-vous a été envoyée au médecin du travail. Vous recevrez une confirmation sous 48h.",
      [
        {
          text: "OK",
          onPress: () => {
            // Programmer une notification de rappel
            scheduleReminder()
            navigation.goBack()
          },
        },
      ],
    )
  }

  const scheduleReminder = () => {
    // Simulation de programmation de notification
    console.log("Notification programmée pour le rappel de RDV")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={24} color="#2563eb" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Dr. Marie Dubois</Text>
            <Text style={styles.infoText}>Médecin du travail</Text>
            <Text style={styles.infoText}>Disponible: Lun-Ven 8h-17h</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Votre nom et prénom" />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Motif de la consultation *</Text>
            <View style={styles.motifContainer}>
              {motifsRDV.map((motif) => (
                <TouchableOpacity
                  key={motif}
                  style={[styles.motifButton, selectedMotif === motif && styles.motifButtonActive]}
                  onPress={() => setSelectedMotif(motif)}
                >
                  <Text style={[styles.motifButtonText, selectedMotif === motif && styles.motifButtonTextActive]}>
                    {motif}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedMotif === "Autre" && (
            <View style={styles.section}>
              <Text style={styles.label}>Précisez le motif</Text>
              <TextInput
                style={styles.textArea}
                value={motif}
                onChangeText={setMotif}
                placeholder="Décrivez votre demande..."
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>Date souhaitée *</Text>
            <TextInput
              style={styles.input}
              value={dateSouhaitee}
              onChangeText={setDateSouhaitee}
              placeholder="JJ/MM/AAAA"
            />
          </View>

          <View style={styles.urgencySection}>
            <View style={styles.urgencyHeader}>
              <MaterialIcons name="priority-high" size={20} color="#ef4444" />
              <Text style={styles.urgencyTitle}>Cas urgent ?</Text>
            </View>
            <Text style={styles.urgencyText}>
              En cas d'urgence médicale, contactez directement le 15 ou rendez-vous aux urgences.
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <MaterialIcons name="phone" size={16} color="#ef4444" />
              <Text style={styles.emergencyButtonText}>Appeler le 15</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <MaterialIcons name="event" size={20} color="white" />
            <Text style={styles.submitButtonText}>Demander le rendez-vous</Text>
          </TouchableOpacity>
        </View>
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
  infoCard: {
    backgroundColor: "#dbeafe",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    height: 80,
    textAlignVertical: "top",
  },
  motifContainer: {
    gap: 8,
  },
  motifButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  motifButtonActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  motifButtonText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  motifButtonTextActive: {
    color: "white",
    fontWeight: "500",
  },
  urgencySection: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  urgencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  urgencyText: {
    fontSize: 14,
    color: "#7f1d1d",
    marginBottom: 12,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 8,
    padding: 12,
  },
  emergencyButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
