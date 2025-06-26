"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

interface PPE {
  id: string
  nom: string
  type: string
  norme: string
  zone: string
  disponible: number
  total: number
  etat: "Bon" | "Usé" | "À remplacer"
  derniereUtilisation: string
}

const mockPPE: PPE[] = [
  {
    id: "1",
    nom: "Casque de sécurité",
    type: "Protection tête",
    norme: "EN 397",
    zone: "Atelier A",
    disponible: 8,
    total: 10,
    etat: "Bon",
    derniereUtilisation: "2024-01-20",
  },
  {
    id: "2",
    nom: "Gants anti-coupure",
    type: "Protection mains",
    norme: "EN 388",
    zone: "Zone de découpe",
    disponible: 3,
    total: 12,
    etat: "Usé",
    derniereUtilisation: "2024-01-21",
  },
  {
    id: "3",
    nom: "Chaussures de sécurité",
    type: "Protection pieds",
    norme: "EN ISO 20345",
    zone: "Production",
    disponible: 0,
    total: 15,
    etat: "À remplacer",
    derniereUtilisation: "2024-01-19",
  },
  {
    id: "4",
    nom: "Lunettes de protection",
    type: "Protection yeux",
    norme: "EN 166",
    zone: "Laboratoire",
    disponible: 6,
    total: 8,
    etat: "Bon",
    derniereUtilisation: "2024-01-21",
  },
]

const zones = ["Toutes", "Atelier A", "Zone de découpe", "Production", "Laboratoire"]

export default function PPEScreen({ navigation }: any) {
  const [ppeList, setPpeList] = useState<PPE[]>(mockPPE)
  const [selectedZone, setSelectedZone] = useState("Toutes")

  const filteredPPE = ppeList.filter((ppe) => selectedZone === "Toutes" || ppe.zone === selectedZone)

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

  const reportDamage = (ppeId: string, ppeName: string) => {
    Alert.alert("Signaler un dommage", `Voulez-vous signaler un dommage sur ${ppeName} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Signaler",
        onPress: () => {
          Alert.alert(
            "Dommage signalé",
            "Le signalement a été envoyé aux responsables. Une notification leur a été envoyée.",
          )
          // Ici on pourrait ajouter la logique pour envoyer une notification
        },
      },
    ])
  }

  const renderPPE = ({ item }: { item: PPE }) => (
    <TouchableOpacity style={styles.ppeCard} onPress={() => navigation.navigate("PPEDetail", { ppe: item })}>
      <View style={styles.ppeHeader}>
        <View style={styles.ppeInfo}>
          <Text style={styles.ppeName}>{item.nom}</Text>
          <Text style={styles.ppeType}>{item.type}</Text>
          <Text style={styles.ppeNorme}>Norme: {item.norme}</Text>
        </View>
        <View style={styles.ppeStatus}>
          <View style={[styles.stateBadge, { backgroundColor: getStateColor(item.etat) }]}>
            <Text style={styles.stateText}>{item.etat}</Text>
          </View>
        </View>
      </View>

      <View style={styles.zoneContainer}>
        <Icon name="location-on" size={16} color="#64748b" />
        <Text style={styles.zoneText}>{item.zone}</Text>
      </View>

      <View style={styles.availabilityContainer}>
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityLabel}>Disponibilité:</Text>
          <Text style={[styles.availabilityText, { color: getAvailabilityColor(item.disponible, item.total) }]}>
            {item.disponible}/{item.total}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(item.disponible / item.total) * 100}%`,
                backgroundColor: getAvailabilityColor(item.disponible, item.total),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.lastUsageContainer}>
        <Text style={styles.lastUsageLabel}>Dernière utilisation:</Text>
        <Text style={styles.lastUsageDate}>{item.derniereUtilisation}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.damageButton} onPress={() => reportDamage(item.id, item.nom)}>
          <Icon name="report-problem" size={16} color="#ef4444" />
          <Text style={styles.damageButtonText}>Signaler dommage</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Équipements de Protection</Text>
      </View>

      <View style={styles.alertsContainer}>
        <View style={styles.alertCard}>
          <Icon name="warning" size={20} color="#f59e0b" />
          <Text style={styles.alertText}>
            {ppeList.filter((ppe) => ppe.disponible === 0).length} EPI en rupture de stock
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="security" size={24} color="#2563eb" />
          <Text style={styles.statNumber}>{ppeList.length}</Text>
          <Text style={styles.statLabel}>Types d'EPI</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{ppeList.filter((ppe) => ppe.etat === "Bon").length}</Text>
          <Text style={styles.statLabel}>En bon état</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="error" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{ppeList.filter((ppe) => ppe.disponible === 0).length}</Text>
          <Text style={styles.statLabel}>En rupture</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={zones}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, selectedZone === item && styles.filterButtonActive]}
              onPress={() => setSelectedZone(item)}
            >
              <Text style={[styles.filterButtonText, selectedZone === item && styles.filterButtonTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredPPE}
        renderItem={renderPPE}
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
  alertsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  alertCard: {
    backgroundColor: "#fef3c7",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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
  ppeCard: {
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
  ppeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ppeInfo: {
    flex: 1,
  },
  ppeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  ppeType: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 2,
  },
  ppeNorme: {
    fontSize: 12,
    color: "#64748b",
  },
  ppeStatus: {
    alignItems: "flex-end",
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stateText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  zoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  zoneText: {
    fontSize: 14,
    color: "#64748b",
  },
  availabilityContainer: {
    marginBottom: 12,
  },
  availabilityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  availabilityLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  lastUsageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  lastUsageLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  lastUsageDate: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  damageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fecaca",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  damageButtonText: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
  },
})
