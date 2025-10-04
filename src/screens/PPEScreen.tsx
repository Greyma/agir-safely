"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface PPE {
  _id: string
  name: string
  category: string
  description: string
  manufacturer: string
  model: string
  serialNumber: string
  condition: string
  status: string
  location: string
  quantity: number
  unit: string
  assignedTo?: {
    name: string
    email: string
  }
  lastInspection: string
  nextInspection: string
  safetyStandard?: string
  usageCondition?: string
  lifespan?: string
}

const zones = ["Toutes", "Atelier A", "Zone de découpe", "Production", "Laboratoire"]

// Local storage key
const PPE_STORAGE_KEY = 'local_ppe_data_v1'

// Random helpers
const randomOf = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const addDays = (date: Date, days: number) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}
const toISO = (d: Date) => d.toISOString()

function generateFromTemplate() {
  // Templates from user's list
  const templates = [
    {
      name: "Casques de sécurité",
      category: "Casque",
      safetyStandard: "EN 397",
      usageCondition: "Port obligatoire dans toutes les zones à risques",
      lifespan: "3 à 5 ans",
    },
    {
      name: "Chaussures de sécurité",
      category: "Chaussures",
      safetyStandard: "EN ISO 20345",
      usageCondition: "Port obligatoire en zones à risques",
      lifespan: "2 ans",
    },
    {
      name: "Lunettes de protection",
      category: "Lunettes",
      safetyStandard: "EN 166",
      usageCondition: "Obligatoires lors de la manipulation de produits chimiques, travaux de meulage, soudure légère ou projection de particules",
      lifespan: "2 à 3 ans",
    },
    {
      name: "Gants de protection",
      category: "Gants",
      safetyStandard: "EN 388",
      usageCondition: "Toute activité présentant un risque de coupure, d’abrasion, de perforation ou d’écrasement léger",
      lifespan: "3 à 6 mois",
    },
    {
      name: "Combinaisons de protection",
      category: "Combinaison",
      safetyStandard: "EN 14605",
      usageCondition: "Port obligatoire pour travaux en laboratoire, nettoyage chimique, interventions sur produits dangereux",
      lifespan: "2 ans",
    },
    {
      name: "Harnais de sécurité",
      category: "Harnais",
      safetyStandard: "EN 361",
      usageCondition: "Obligatoire pour tout travail en hauteur >2 m",
      lifespan: "10 ans maximum",
    },
    {
      name: "Serre-tête antibruit",
      category: "Antibruit",
      safetyStandard: "EN 352-1",
      usageCondition: "Obligatoire dans les zones où le bruit ambiant est élevé",
      lifespan: "2 à 3 ans",
    },
    {
      name: "Masques respiratoires",
      category: "Masque",
      safetyStandard: "EN 136",
      usageCondition: "Port obligatoire dans zones à risque de poussières fines",
      lifespan: "5 à 10 ans",
    },
  ]

  const manufacturers = ["3M", "Honeywell", "Uvex", "MSA", "Delta Plus", "JSP"]
  const units = ["pièces", "paires", "unités"]
  const conditions = ["excellent", "good", "fair", "poor", "damaged"]
  const statuses = ["available", "assigned", "maintenance", "retired", "lost"]
  const locs = zones.filter(z => z !== "Toutes")

  const now = new Date()

  const items: PPE[] = templates.map((t, index) => {
    const manufacturer = randomOf(manufacturers)
    const model = `${t.category.substring(0, 3).toUpperCase()}-${randomInt(100, 999)}`
    const serialNumber = `${t.category.substring(0, 2).toUpperCase()}${Date.now()}${randomInt(100, 999)}`
    const condition = randomOf(conditions)
    const status = condition === "damaged" ? "maintenance" : randomOf(statuses)
    const location = randomOf(locs)
    const quantity = randomInt(3, 20)
    const unit = randomOf(units)

    const last = addDays(now, -randomInt(10, 120))
    const next = addDays(last, randomInt(15, 120))

    const maybeAssigned = Math.random() < 0.4
    const assignedTo = maybeAssigned
      ? { name: randomOf(["Alice Martin", "Jean Dupont", "Karim El Amrani", "Sofia Ben Ali"]), email: `user${randomInt(1, 99)}@example.com` }
      : undefined

    return {
      _id: `ppe_${index + 1}`,
      name: t.name,
      category: t.category,
      description: `${t.name} - ${t.usageCondition}. Conforme à la norme ${t.safetyStandard}.`,
      manufacturer,
      model,
      serialNumber,
      condition,
      status,
      location,
      quantity,
      unit,
      assignedTo,
      lastInspection: toISO(last),
      nextInspection: toISO(next),
      safetyStandard: t.safetyStandard,
      usageCondition: t.usageCondition,
      lifespan: t.lifespan,
    }
  })

  return items
}

export default function PPEScreen({ navigation }: any) {
  const [ppeList, setPpeList] = useState<PPE[]>([])
  const [selectedZone, setSelectedZone] = useState("Toutes")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadFromStorage = async () => {
    const raw = await AsyncStorage.getItem(PPE_STORAGE_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed as PPE[] : null
    } catch {
      return null
    }
  }

  const saveToStorage = async (data: PPE[]) => {
    await AsyncStorage.setItem(PPE_STORAGE_KEY, JSON.stringify(data))
  }

  const fetchPPE = async () => {
    try {
      setLoading(true)
      let data = await loadFromStorage()
      if (!data || data.length === 0) {
        data = generateFromTemplate()
        await saveToStorage(data)
      }
      setPpeList(data)
    } catch (error) {
      console.error('Error loading PPE from storage:', error)
      Alert.alert('Erreur', 'Impossible de charger les EPI')
      setPpeList([])
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchPPE()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchPPE()
  }, [])

  const filteredPPE = ppeList.filter((ppe) => selectedZone === "Toutes" || ppe.location === selectedZone)

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "#10b981"
      case "assigned":
        return "#f59e0b"
      case "maintenance":
        return "#ef4444"
      case "retired":
      case "lost":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getStateColor = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return "#10b981"
      case "fair":
        return "#f59e0b"
      case "poor":
      case "damaged":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStateText = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "Excellent"
      case "good":
        return "Bon"
      case "fair":
        return "Usé"
      case "poor":
        return "Mauvais"
      case "damaged":
        return "À remplacer"
      default:
        return condition
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "assigned":
        return "Assigné"
      case "maintenance":
        return "Maintenance"
      case "retired":
        return "Retiré"
      case "lost":
        return "Perdu"
      default:
        return status
    }
  }

  const reportDamage = async (ppeId: string, ppeName: string) => {
    Alert.alert("Signaler un dommage", `Voulez-vous signaler un dommage sur ${ppeName} ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Signaler",
        onPress: async () => {
          try {
            // Update local item
            const updated = ppeList.map(item => {
              if (item._id !== ppeId) return item
              const now = new Date()
              return {
                ...item,
                condition: "damaged",
                status: "maintenance",
                lastInspection: toISO(now),
                nextInspection: toISO(addDays(now, 30)),
              }
            })
            setPpeList(updated)
            await saveToStorage(updated)

            Alert.alert(
              "Dommage signalé",
              "Le signalement a été enregistré localement."
            )
          } catch (error) {
            console.error('Error reporting damage:', error)
            Alert.alert('Erreur', 'Impossible de signaler le dommage')
          }
        },
      },
    ])
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    } catch (error) {
      return 'Date invalide'
    }
  }

  const renderPPE = ({ item }: { item: PPE }) => (
    <TouchableOpacity style={styles.ppeCard} onPress={() => navigation.navigate("PPEDetail", { ppe: item })}>
      <View style={styles.ppeHeader}>
        <View style={styles.ppeInfo}>
          <Text style={styles.ppeName}>{item.name}</Text>
          <Text style={styles.ppeType}>{item.category}</Text>
          <Text style={styles.ppeNorme}>Modèle: {item.model}</Text>
        </View>
        <View style={styles.ppeStatus}>
          <View style={[styles.stateBadge, { backgroundColor: getStateColor(item.condition) }]}>
            <Text style={styles.stateText}>{getStateText(item.condition)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.zoneContainer}>
        <MaterialIcons name="location-on" size={16} color="#64748b" />
        <Text style={styles.zoneText}>{item.location}</Text>
      </View>

      <View style={styles.availabilityContainer}>
        <View style={styles.availabilityInfo}>
          <Text style={styles.availabilityLabel}>Statut:</Text>
          <Text style={[styles.availabilityText, { color: getAvailabilityColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        <View style={styles.quantityInfo}>
          <Text style={styles.quantityLabel}>Quantité:</Text>
          <Text style={styles.quantityText}>{item.quantity} {item.unit}</Text>
        </View>
      </View>

      <View style={styles.lastUsageContainer}>
        <Text style={styles.lastUsageLabel}>Dernière inspection:</Text>
        <Text style={styles.lastUsageDate}>{formatDate(item.lastInspection)}</Text>
      </View>

      <View style={styles.nextInspectionContainer}>
        <Text style={styles.nextInspectionLabel}>Prochaine inspection:</Text>
        <Text style={styles.nextInspectionDate}>{formatDate(item.nextInspection)}</Text>
      </View>

      {item.assignedTo && (
        <View style={styles.assignedContainer}>
          <Text style={styles.assignedLabel}>Assigné à:</Text>
          {}
          {}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.damageButton} onPress={() => reportDamage(item._id, item.name)}>
          <MaterialIcons name="report-problem" size={16} color="#ef4444" />
          <Text style={styles.damageButtonText}>Signaler dommage</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement des EPI...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Équipement de Protection Individuelle</Text>
      </View>

      <View style={styles.alertsContainer}>
        <View style={styles.alertCard}>
          <MaterialIcons name="warning" size={20} color="#f59e0b" />
          <Text style={styles.alertText}>
            {ppeList.filter((ppe) => ppe.status === "maintenance").length} EPI en maintenance
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="security" size={24} color="#2563eb" />
          <Text style={styles.statNumber}>{ppeList.length}</Text>
          <Text style={styles.statLabel}>Types d'EPI</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{ppeList.filter((ppe) => ppe.condition === "excellent" || ppe.condition === "good").length}</Text>
          <Text style={styles.statLabel}>En bon état</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="error" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{ppeList.filter((ppe) => ppe.status === "maintenance").length}</Text>
          <Text style={styles.statLabel}>En maintenance</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={zones}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.zoneButton, selectedZone === item && styles.zoneButtonActive]}
              onPress={() => setSelectedZone(item)}
            >
              <Text style={[styles.zoneButtonText, selectedZone === item && styles.zoneButtonTextActive]}>
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
        keyExtractor={(item) => item._id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="security" size={48} color="#64748b" />
            <Text style={styles.emptyText}>Aucun EPI trouvé</Text>
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
  zoneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  zoneButtonActive: {
    backgroundColor: "#2563eb",
  },
  zoneButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  zoneButtonTextActive: {
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
  quantityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
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
  nextInspectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  nextInspectionLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  nextInspectionDate: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  assignedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  assignedLabel: {
    fontSize: 14,
    color: "#64748b",
    marginRight: 4,
  },
  assignedName: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
})
