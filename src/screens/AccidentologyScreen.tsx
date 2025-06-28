"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"

interface Accident {
  _id: string
  title: string
  description: string
  date: string
  location: string
  severity: "minor" | "moderate" | "severe" | "critical"
  type: string
  status: string
  reportedBy: {
    name: string
    email: string
  }
}

export default function AccidentologyScreen({ navigation }: any) {
  const [accidents, setAccidents] = useState<Accident[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAccidents = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAccidents()
      setAccidents(data)
    } catch (error) {
      console.error('Error fetching accidents:', error)
      Alert.alert('Erreur', 'Impossible de charger les accidents')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchAccidents()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchAccidents()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "#10b981"
      case "moderate":
        return "#f59e0b"
      case "severe":
        return "#ef4444"
      case "critical":
        return "#7c2d12"
      default:
        return "#6b7280"
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
  }

  const showLocationMap = () => {
    Alert.alert("Cartographie", "Fonctionnalité de cartographie en développement")
  }

  const renderAccident = ({ item }: { item: Accident }) => (
    <View style={styles.accidentCard}>
      <View style={styles.accidentHeader}>
        <Text style={styles.accidentDate}>{formatDate(item.date)}</Text>
        <View style={[styles.gravityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.gravityText}>{getSeverityText(item.severity)}</Text>
        </View>
      </View>
      <Text style={styles.accidentTitle}>{item.title}</Text>
      <Text style={styles.accidentLocation}>{item.location}</Text>
      <Text style={styles.accidentDescription}>{item.description}</Text>
      <View style={styles.accidentFooter}>
        <Text style={styles.reportedBy}>Signalé par: {item.reportedBy?.name || 'Utilisateur'}</Text>
        <TouchableOpacity style={styles.mapButton} onPress={showLocationMap}>
          <MaterialIcons name="location-on" size={16} color="#2563eb" />
          <Text style={styles.mapButtonText}>Voir sur la carte</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement des accidents...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accidentologies</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddAccident")}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{accidents.length}</Text>
          <Text style={styles.statLabel}>Total accidents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{accidents.filter((a) => a.severity === "severe" || a.severity === "critical").length}</Text>
          <Text style={styles.statLabel}>Graves</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{accidents.filter((a) => {
            const accidentDate = new Date(a.date)
            const now = new Date()
            return accidentDate.getMonth() === now.getMonth() && accidentDate.getFullYear() === now.getFullYear()
          }).length}</Text>
          <Text style={styles.statLabel}>Ce mois</Text>
        </View>
      </View>

      <FlatList
        data={accidents}
        renderItem={renderAccident}
        keyExtractor={(item) => item._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="warning" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Aucun accident enregistré</Text>
            <Text style={styles.emptySubtext}>Les accidents apparaîtront ici une fois signalés</Text>
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
  addButton: {
    backgroundColor: "#2563eb",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accidentCard: {
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
  accidentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accidentDate: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  gravityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gravityText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  accidentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  accidentLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  accidentDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },
  accidentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportedBy: {
    fontSize: 14,
    color: "#64748b",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mapButtonText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
  },
})
