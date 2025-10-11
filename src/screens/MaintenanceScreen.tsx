"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"

interface Equipment {
  _id: string
  name: string
  type: string
  model: string
  manufacturer: string
  status: string
  condition: string
  location: string
  lastMaintenance: string
  nextMaintenance: string
  assignedTo: {
    name: string
    email: string
  }
  alerts: Array<{
    type: string
    message: string
    isActive: boolean
  }>
}

export default function MaintenanceScreen({ navigation }: any) {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [selectedFilter, setSelectedFilter] = useState<"Tous" | "functional" | "maintenance" | "broken">("Tous")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const data = await apiService.getEquipment()
      // Ensure data is always an array
      setEquipments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
      Alert.alert('Erreur', 'Impossible de charger les équipements')
      setEquipments([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchEquipment()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const filteredEquipments = equipments.filter((eq) => selectedFilter === "Tous" || eq.status === selectedFilter)

  const alertsCount = equipments.filter((eq) => (eq.alerts || []).some(alert => alert.isActive)).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "functional":
        return "#10b981"
      case "maintenance":
        return "#f59e0b"
      case "broken":
        return "#ef4444"
      case "retired":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "functional":
        return "check-circle"
      case "maintenance":
        return "build"
      case "broken":
        return "error"
      case "retired":
        return "block"
      default:
        return "help"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "functional":
        return "Fonctionnel"
      case "maintenance":
        return "En maintenance"
      case "broken":
        return "En panne"
      case "retired":
        return "Retiré"
      default:
        return status
    }
  }

  // Removed per request: status change buttons and updater

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    } catch (error) {
      return 'Date invalide'
    }
  }

  const renderEquipment = ({ item }: { item: Equipment }) => (
    <TouchableOpacity
      style={styles.equipmentCard}
      onPress={() =>
        navigation.navigate("EquipmentDetail", {
          equipment: {
            nom: item.name,
            type: item.type,
            zone: item.location,
            etat: getStatusText(item.status), // functional -> "Fonctionnel", etc.
            derniereMaintenance: formatDate(item.lastMaintenance),
            prochaineMaintenance: formatDate(item.nextMaintenance),
            alerteActive: (item.alerts || []).some(a => a.isActive),
          },
        })
      }
    >
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{item.name}</Text>
          <Text style={styles.equipmentType}>{item.type}</Text>
          <Text style={styles.equipmentZone}>{item.location}</Text>
        </View>
        <View style={styles.statusContainer}>
          {(item.alerts || []).some(alert => alert.isActive) && (
            <MaterialIcons name="warning" size={16} color="#f59e0b" style={styles.alertIcon} />
          )}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <MaterialIcons name={getStatusIcon(item.status)} size={14} color="white" />
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.equipmentDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Modèle:</Text>
          <Text style={styles.detailValue}>{item.model}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Fabricant:</Text>
          <Text style={styles.detailValue}>{item.manufacturer}</Text>
        </View>
        {item.assignedTo && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Assigné à:</Text>
            <Text style={styles.detailValue}>{item.assignedTo.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.maintenanceInfo}>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Dernière maintenance:</Text>
          <Text style={styles.maintenanceDate}>{formatDate(item.lastMaintenance)}</Text>
        </View>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Prochaine maintenance:</Text>
          <Text style={[styles.maintenanceDate, (item.alerts || []).some(alert => alert.isActive) && styles.maintenanceDateAlert]}>
            {formatDate(item.nextMaintenance)}
          </Text>
        </View>
      </View>

      {/* Status action buttons removed */}
    </TouchableOpacity>
  )

  const maintenanceProgramPdf =
    "https://raw.githubusercontent.com/yacinecs/pdf/8b4a2647d2073c52fc67935cd00388afa42e3318/3.SUIVI%20DU%20PLAN%20DE%20MAINTENANCE%20PREVENTIF%20(1)(1).pdf"

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement des équipements...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maintenance & Réparation</Text>
      </View>

      {alertsCount > 0 && (
        <View style={styles.alertBanner}>
          <MaterialIcons name="warning" size={20} color="#f59e0b" />
          <Text style={styles.alertText}>
            {alertsCount} équipement{alertsCount > 1 ? "s" : ""} nécessite{alertsCount > 1 ? "nt" : ""} une attention
          </Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.status === "functional").length}</Text>
          <Text style={styles.statLabel}>Fonctionnels</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="build" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.status === "maintenance").length}</Text>
          <Text style={styles.statLabel}>En maintenance</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="error" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.status === "broken").length}</Text>
          <Text style={styles.statLabel}>En panne</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={["Tous", "functional", "maintenance", "broken"] as const}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === item && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.filterButtonText, selectedFilter === item && styles.filterButtonTextActive]}>
                {item === "Tous" ? "Tous" : getStatusText(item)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredEquipments}
        renderItem={renderEquipment}
        keyExtractor={(item) => item._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View style={styles.programSection}>
            <Text style={styles.programTitle}>Programme de maintenance</Text>
            <Text style={styles.programSubtitle}>
              Consulter le plan de suivi préventif
            </Text>
            <TouchableOpacity
              style={styles.programButton}
              onPress={() =>
                navigation.navigate("PdfViewer", {
                  pdfUrl: maintenanceProgramPdf,
                  title: "Programme de maintenance",
                })
              }
            >
              <MaterialIcons name="picture-as-pdf" size={20} color="white" />
              <Text style={styles.programButtonText}>Voir le PDF</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="build" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Aucun équipement trouvé</Text>
            <Text style={styles.emptySubtext}>Les équipements apparaîtront ici une fois ajoutés</Text>
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
  alertBanner: {
    backgroundColor: "#fef3c7",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    color: "#92400e",
    fontWeight: "500",
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
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  filterButtonActive: {
    backgroundColor: "#2563eb",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  filterButtonTextActive: {
    color: "white",
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  equipmentCard: {
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
  equipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  equipmentType: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  equipmentZone: {
    fontSize: 14,
    color: "#64748b",
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  alertIcon: {
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  equipmentDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  maintenanceInfo: {
    marginBottom: 16,
  },
  maintenanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  maintenanceLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  maintenanceDate: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  maintenanceDateAlert: {
    color: "#ef4444",
  },
  // Removed styles for action buttons per request
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
  programSection: {
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  programSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 12,
  },
  programButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    justifyContent: "center",
    borderRadius: 8,
  },
  programButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
})


