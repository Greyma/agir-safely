"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'

interface UsageRecord {
  id: string
  date: string
  utilisateur: string
  duree: string
  etat: string
}

const mockUsageRecords: UsageRecord[] = [
  {
    id: "1",
    date: "2024-01-21",
    utilisateur: "Jean Dupont",
    duree: "8h",
    etat: "Bon état après utilisation",
  },
  {
    id: "2",
    date: "2024-01-20",
    utilisateur: "Marie Martin",
    duree: "6h",
    etat: "Légère usure constatée",
  },
  {
    id: "3",
    date: "2024-01-19",
    utilisateur: "Pierre Durand",
    duree: "4h",
    etat: "Bon état après utilisation",
  },
]

export default function PPEDetailScreen({ route }: any) {
  const { ppe } = route.params
  const [usageRecords] = useState<UsageRecord[]>(mockUsageRecords)
  const [damageDescription, setDamageDescription] = useState("")
  const [showDamageForm, setShowDamageForm] = useState(false)

  const getAvailabilityColor = (disponible: number, total: number) => {
    const ratio = disponible / total
    if (ratio === 0) return "#ef4444"
    if (ratio < 0.3) return "#f59e0b"
    return "#10b981"
  }

  const getStateColor = (etat: string) => {
    switch (etat) {
      case "Bon":
        return "#10b981"
      case "Usé":
        return "#f59e0b"
      case "À remplacer":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const submitDamageReport = () => {
    if (!damageDescription.trim()) {
      Alert.alert("Erreur", "Veuillez décrire le dommage")
      return
    }

    Alert.alert(
      "Dommage signalé",
      "Le signalement a été envoyé aux responsables. Une notification leur a été envoyée.",
      [
        {
          text: "OK",
          onPress: () => {
            setDamageDescription("")
            setShowDamageForm(false)
          },
        },
      ],
    )
  }

  const addPhoto = () => {
    Alert.alert("Photo", "Fonctionnalité d'ajout de photo en développement")
  }

  const recordUsage = () => {
    Alert.alert("Enregistrer utilisation", "Voulez-vous enregistrer une nouvelle utilisation de cet EPI ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Enregistrer",
        onPress: () => Alert.alert("Utilisation enregistrée", "L'utilisation a été ajoutée au suivi."),
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.ppeInfo}>
            <Text style={styles.ppeName}>{ppe.nom}</Text>
            <Text style={styles.ppeType}>{ppe.type}</Text>
            <Text style={styles.ppeNorme}>Norme: {ppe.norme}</Text>
          </View>
          <View style={[styles.stateBadge, { backgroundColor: getStateColor(ppe.etat) }]}>
            <Text style={styles.stateText}>{ppe.etat}</Text>
          </View>
        </View>

        <View style={styles.availabilityCard}>
          <Text style={styles.cardTitle}>Disponibilité</Text>
          <View style={styles.availabilityInfo}>
            <Text style={styles.availabilityLabel}>Zone: {ppe.zone}</Text>
            <Text style={[styles.availabilityText, { color: getAvailabilityColor(ppe.disponible, ppe.total) }]}>
              {ppe.disponible}/{ppe.total} disponibles
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(ppe.disponible / ppe.total) * 100}%`,
                  backgroundColor: getAvailabilityColor(ppe.disponible, ppe.total),
                },
              ]}
            />
          </View>
          {ppe.disponible === 0 && (
            <View style={styles.stockAlert}>
              <MaterialIcons name="warning" size={16} color="#ef4444" />
              <Text style={styles.stockAlertText}>Stock épuisé - Commande nécessaire</Text>
            </View>
          )}
        </View>

        <View style={styles.specificationsCard}>
          <Text style={styles.cardTitle}>Spécifications</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Norme de sécurité:</Text>
            <Text style={styles.specValue}>{ppe.norme}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Conditions d'utilisation:</Text>
            <Text style={styles.specValue}>Environnement industriel</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Durée de vie:</Text>
            <Text style={styles.specValue}>12 mois</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Dernière inspection:</Text>
            <Text style={styles.specValue}>15/01/2024</Text>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={recordUsage}>
              <MaterialIcons name="add-circle" size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Enregistrer utilisation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.damageActionButton]}
              onPress={() => setShowDamageForm(!showDamageForm)}
            >
              <MaterialIcons name="report-problem" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, styles.damageActionText]}>Signaler dommage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDamageForm && (
          <View style={styles.damageFormCard}>
            <Text style={styles.cardTitle}>Signalement de Dommage</Text>
            <TextInput
              style={styles.damageInput}
              value={damageDescription}
              onChangeText={setDamageDescription}
              placeholder="Décrivez le dommage constaté..."
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.photoButton} onPress={addPhoto}>
              <MaterialIcons name="camera-alt" size={20} color="#64748b" />
              <Text style={styles.photoButtonText}>Ajouter une photo</Text>
            </TouchableOpacity>
            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDamageForm(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={submitDamageReport}>
                <Text style={styles.submitButtonText}>Signaler</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.usageHistoryCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.cardTitle}>Historique d'Utilisation</Text>
            <Text style={styles.historyCount}>{(usageRecords || []).length} utilisations</Text>
          </View>

          {(usageRecords || []).map((record) => (
            <View key={record.id} style={styles.usageRecord}>
              <View style={styles.usageHeader}>
                <Text style={styles.usageDate}>{record.date}</Text>
                <Text style={styles.usageDuration}>{record.duree}</Text>
              </View>
              <Text style={styles.usageUser}>Utilisateur: {record.utilisateur}</Text>
              <Text style={styles.usageState}>{record.etat}</Text>
            </View>
          ))}
        </View>

        <View style={styles.catalogCard}>
          <Text style={styles.cardTitle}>Informations Catalogue</Text>
          <View style={styles.catalogInfo}>
            <View style={styles.catalogImagePlaceholder}>
              <MaterialIcons name="image" size={40} color="#64748b" />
            </View>
            <View style={styles.catalogDetails}>
              <Text style={styles.catalogName}>{ppe.nom}</Text>
              <Text style={styles.catalogDescription}>
                Équipement de protection individuelle conforme aux normes européennes. Conçu pour une utilisation en
                milieu industriel.
              </Text>
              <View style={styles.catalogSpecs}>
                <Text style={styles.catalogSpec}>• Résistant aux chocs</Text>
                <Text style={styles.catalogSpec}>• Matériaux durables</Text>
                <Text style={styles.catalogSpec}>• Confort d'utilisation</Text>
              </View>
            </View>
          </View>
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
  header: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ppeInfo: {
    flex: 1,
  },
  ppeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  ppeType: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 2,
  },
  ppeNorme: {
    fontSize: 14,
    color: "#64748b",
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  availabilityCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  availabilityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  availabilityLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stockAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fecaca",
    padding: 8,
    borderRadius: 6,
    gap: 6,
  },
  stockAlertText: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
  },
  specificationsCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  actionsCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  damageActionButton: {
    backgroundColor: "#fecaca",
  },
  actionButtonText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  damageActionText: {
    color: "#ef4444",
  },
  damageFormCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  damageInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  photoButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  usageHistoryCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyCount: {
    fontSize: 14,
    color: "#64748b",
  },
  usageRecord: {
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    paddingLeft: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  usageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  usageDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  usageDuration: {
    fontSize: 12,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  usageUser: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  usageState: {
    fontSize: 13,
    color: "#1e293b",
  },
  catalogCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  catalogInfo: {
    flexDirection: "row",
    gap: 16,
  },
  catalogImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  catalogDetails: {
    flex: 1,
  },
  catalogName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  catalogDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 8,
  },
  catalogSpecs: {
    gap: 2,
  },
  catalogSpec: {
    fontSize: 12,
    color: "#64748b",
  },
})
