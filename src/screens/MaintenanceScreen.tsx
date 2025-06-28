"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'

interface Equipment {
  id: string
  nom: string
  type: string
  etat: "Fonctionnel" | "En maintenance" | "En panne"
  derniereMaintenance: string
  prochaineMaintenance: string
  zone: string
  alerteActive: boolean
}

const mockEquipments: Equipment[] = [
  {
    id: "1",
    nom: "Compresseur A1",
    type: "Compresseur d'air",
    etat: "Fonctionnel",
    derniereMaintenance: "2024-01-10",
    prochaineMaintenance: "2024-04-10",
    zone: "Atelier A",
    alerteActive: false,
  },
  {
    id: "2",
    nom: "Pont roulant B2",
    type: "Équipement de levage",
    etat: "En maintenance",
    derniereMaintenance: "2024-01-15",
    prochaineMaintenance: "2024-01-25",
    zone: "Entrepôt B",
    alerteActive: true,
  },
  {
    id: "3",
    nom: "Presse hydraulique C1",
    type: "Machine-outil",
    etat: "En panne",
    derniereMaintenance: "2023-12-20",
    prochaineMaintenance: "2024-01-20",
    zone: "Production C",
    alerteActive: true,
  },
  {
    id: "4",
    nom: "Ventilation D1",
    type: "Système de ventilation",
    etat: "Fonctionnel",
    derniereMaintenance: "2024-01-05",
    prochaineMaintenance: "2024-02-05",
    zone: "Zone D",
    alerteActive: true,
  },
]

export default function MaintenanceScreen({ navigation }: any) {
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments)
  const [selectedFilter, setSelectedFilter] = useState<"Tous" | "Fonctionnel" | "En maintenance" | "En panne">("Tous")

  const filteredEquipments = equipments.filter((eq) => selectedFilter === "Tous" || eq.etat === selectedFilter)

  const alertsCount = equipments.filter((eq) => eq.alerteActive).length

  const getStatusColor = (etat: string) => {
    switch (etat) {
      case "Fonctionnel":
        return "#10b981"
      case "En maintenance":
        return "#f59e0b"
      case "En panne":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (etat: string) => {
    switch (etat) {
      case "Fonctionnel":
        return "check-circle"
      case "En maintenance":
        return "build"
      case "En panne":
        return "error"
      default:
        return "help"
    }
  }

  const updateEquipmentStatus = (id: string, newStatus: Equipment["etat"]) => {
    setEquipments((prev) => prev.map((eq) => (eq.id === id ? { ...eq, etat: newStatus } : eq)))
    Alert.alert("Statut mis à jour", `L'équipement a été marqué comme "${newStatus}"`)
  }

  const renderEquipment = ({ item }: { item: Equipment }) => (
    <TouchableOpacity
      style={styles.equipmentCard}
      onPress={() => navigation.navigate("EquipmentDetail", { equipment: item })}
    >
      <View style={styles.equipmentHeader}>
        <View style={styles.equipmentInfo}>
          <Text style={styles.equipmentName}>{item.nom}</Text>
          <Text style={styles.equipmentType}>{item.type}</Text>
          <Text style={styles.equipmentZone}>{item.zone}</Text>
        </View>
        <View style={styles.statusContainer}>
          {item.alerteActive && <MaterialIcons name="warning" size={16} color="#f59e0b" style={styles.alertIcon} />}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.etat) }]}>
            <MaterialIcons name={getStatusIcon(item.etat)} size={14} color="white" />
            <Text style={styles.statusText}>{item.etat}</Text>
          </View>
        </View>
      </View>

      <View style={styles.maintenanceInfo}>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Dernière maintenance:</Text>
          <Text style={styles.maintenanceDate}>{item.derniereMaintenance}</Text>
        </View>
        <View style={styles.maintenanceItem}>
          <Text style={styles.maintenanceLabel}>Prochaine maintenance:</Text>
          <Text style={[styles.maintenanceDate, item.alerteActive && styles.maintenanceDateAlert]}>
            {item.prochaineMaintenance}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.functionalButton]}
          onPress={() => updateEquipmentStatus(item.id, "Fonctionnel")}
        >
          <Text style={styles.actionButtonText}>Fonctionnel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.maintenanceButton]}
          onPress={() => updateEquipmentStatus(item.id, "En maintenance")}
        >
          <Text style={styles.actionButtonText}>Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.brokenButton]}
          onPress={() => updateEquipmentStatus(item.id, "En panne")}
        >
          <Text style={styles.actionButtonText}>En panne</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

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
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.etat === "Fonctionnel").length}</Text>
          <Text style={styles.statLabel}>Fonctionnels</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="build" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.etat === "En maintenance").length}</Text>
          <Text style={styles.statLabel}>En maintenance</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="error" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{equipments.filter((eq) => eq.etat === "En panne").length}</Text>
          <Text style={styles.statLabel}>En panne</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={["Tous", "Fonctionnel", "En maintenance", "En panne"] as const}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === item && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text style={[styles.filterButtonText, selectedFilter === item && styles.filterButtonTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredEquipments}
        renderItem={renderEquipment}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  functionalButton: {
    backgroundColor: "#dcfce7",
  },
  maintenanceButton: {
    backgroundColor: "#fef3c7",
  },
  brokenButton: {
    backgroundColor: "#fecaca",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },
})
