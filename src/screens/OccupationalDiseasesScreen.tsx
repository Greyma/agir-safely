"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"

interface Disease {
  _id: string
  name: string
  description: string
  symptoms: string[]
  riskFactors: string[]
  prevention: string[]
  treatment: string[]
  riskSector: string
  severity: string
  status: string
  reportedBy: {
    name: string
    email: string
  }
  reportedDate: string
}

export default function OccupationalDiseasesScreen({ navigation }: any) {
  const [diseases, setDiseases] = useState<Disease[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDiseases = async () => {
    try {
      setLoading(true)
      const data = await apiService.getDiseases()
      // Ensure data is always an array
      setDiseases(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching diseases:', error)
      Alert.alert('Erreur', 'Impossible de charger les maladies professionnelles')
      setDiseases([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchDiseases()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDiseases()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ef4444"
      case "high":
        return "#f59e0b"
      case "medium":
        return "#3b82f6"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "Critique"
      case "high":
        return "Élevé"
      case "medium":
        return "Moyen"
      case "low":
        return "Faible"
      default:
        return severity
    }
  }

  const scheduleNotification = async (message: string) => {
    try {
      // Schedule a medical checkup appointment
      const appointmentData = {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        time: "09:00",
        type: "medical-checkup",
        description: "Visite médicale annuelle programmée"
      }

      await apiService.scheduleAppointment(appointmentData)
      
      Alert.alert("Rendez-vous programmé", "Votre visite médicale a été programmée dans 7 jours")
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      Alert.alert('Erreur', 'Impossible de programmer le rendez-vous')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    } catch (error) {
      return 'Date invalide'
    }
  }

  const renderDisease = ({ item }: { item: Disease }) => (
    <View style={styles.diseaseCard}>
      <View style={styles.diseaseHeader}>
        <Text style={styles.diseaseName}>{item.name}</Text>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{getSeverityText(item.severity)}</Text>
        </View>
      </View>

      <Text style={styles.diseaseDescription}>{item.description}</Text>

      <View style={styles.sectorContainer}>
        <MaterialIcons name="business" size={16} color="#64748b" />
        <Text style={styles.sectorText}>{item.riskSector}</Text>
      </View>

      <View style={styles.symptomsSection}>
        <Text style={styles.sectionTitle}>Symptômes principaux:</Text>
        {(item.symptoms || []).slice(0, 2).map((symptome, index) => (
          <Text key={index} style={styles.symptomText}>
            • {symptome}
          </Text>
        ))}
        {(item.symptoms || []).length > 2 && (
          <Text style={styles.moreText}>+{(item.symptoms || []).length - 2} autres symptômes</Text>
        )}
      </View>

      <View style={styles.preventionSection}>
        <Text style={styles.sectionTitle}>Prévention:</Text>
        <Text style={styles.preventionText}>• {(item.prevention || [])[0] || 'Aucune mesure préventive'}</Text>
        {(item.prevention || []).length > 1 && (
          <Text style={styles.moreText}>+{(item.prevention || []).length - 1} autres mesures</Text>
        )}
      </View>

      <View style={styles.reportedInfo}>
        <Text style={styles.reportedLabel}>Signalé par:</Text>
        <Text style={styles.reportedName}>{item.reportedBy?.name || 'Utilisateur'}</Text>
        <Text style={styles.reportedDate}>{formatDate(item.reportedDate)}</Text>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement des maladies professionnelles...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maladies Professionnelles</Text>
        <TouchableOpacity style={styles.appointmentButton} onPress={() => navigation.navigate("Appointment")}>
          <MaterialIcons name="event" size={20} color="white" />
          <Text style={styles.appointmentButtonText}>RDV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alertSection}>
        <View style={styles.alertCard}>
          <MaterialIcons name="info" size={24} color="#2563eb" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Prochaine visite médicale</Text>
            <Text style={styles.alertText}>Pensez à programmer votre visite annuelle</Text>
          </View>
          <TouchableOpacity onPress={() => scheduleNotification("Rappel: Visite médicale dans 7 jours")}>
            <MaterialIcons name="notifications" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="local-hospital" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{diseases.length}</Text>
          <Text style={styles.statLabel}>Maladies répertoriées</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="shield" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{diseases.reduce((total, disease) => total + (disease.prevention || []).length, 0)}</Text>
          <Text style={styles.statLabel}>Mesures préventives</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="warning" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{diseases.filter(d => d.severity === "high" || d.severity === "critical").length}</Text>
          <Text style={styles.statLabel}>Risques élevés</Text>
        </View>
      </View>

      <FlatList
        data={diseases}
        renderItem={renderDisease}
        keyExtractor={(item) => item._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="local-hospital" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Aucune maladie professionnelle répertoriée</Text>
            <Text style={styles.emptySubtext}>Les maladies apparaîtront ici une fois signalées</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  appointmentButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  appointmentButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  alertSection: {
    padding: 20,
  },
  alertCard: {
    backgroundColor: "#dbeafe",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: "#64748b",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  diseaseCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diseaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  diseaseDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 16,
  },
  sectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectorText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 8,
  },
  symptomsSection: {
    marginBottom: 12,
  },
  preventionSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  symptomText: {
    fontSize: 13,
    color: "#ef4444",
    marginBottom: 2,
  },
  preventionText: {
    fontSize: 13,
    color: "#10b981",
    marginBottom: 2,
  },
  moreText: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 4,
  },
  reportedInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  reportedLabel: {
    fontSize: 12,
    color: "#64748b",
    marginRight: 8,
  },
  reportedName: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "600",
  },
  reportedDate: {
    fontSize: 12,
    color: "#64748b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
  },
})
