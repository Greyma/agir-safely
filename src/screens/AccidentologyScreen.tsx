"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

// Update the Accident interface to match your new MongoDB format
interface Accident {
  _id?: string
  Identifiant?: string
  Entreprise: string
  Produit_concerné: string
  Date_et_heure: string
  Lieu: string
  Déroulement_de_l_accident: string
  Conséquences_humaines: string
  Causes_principales: string[]
  Gravité?: string
  Type?: string
  Mesures_immédiates?: string[]
  Mesures_préventives?: string[]
  Statut?: string
  Signalé_par?: string
  Assigné_à?: string
  Témoins?: any[]
  Pièces_jointes?: any[]
  Créé_le?: string
  Mis_à_jour_le?: string
  Version?: number
}

export default function AccidentologyScreen({ navigation }: any) {
  const [accidents, setAccidents] = useState<Accident[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAccidents = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAccidents()
      // Ensure data is always an array
      const list = Array.isArray(data) ? data : []
      // Remove any seed/test item named "test one"
      const filtered = list.filter((a: any) => {
        const title = (a.title || a.Entreprise || "").toString().trim().toLowerCase()
        return title !== 'test one'
      })
      setAccidents(filtered)
    } catch (error) {
      console.error('Error fetching accidents:', error)
      Alert.alert('Erreur', 'Impossible de charger les accidents')
      setAccidents([]) // Set empty array on error
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

  // Refresh when screen gains focus (e.g., after adding an accident)
  useFocusEffect(
    useCallback(() => {
      fetchAccidents()
    }, [])
  )

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
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    } catch (error) {
      return 'Date invalide'
    }
  }

  const showLocationMap = () => {
    Alert.alert("Cartographie", "Fonctionnalité de cartographie en développement")
  }

  const renderAccident = ({ item }: { item: any }) => {
    // Detect if this is a new-format (French fields) or old-format (English fields) accident
    const isFrench = !!item.Entreprise;
    const severityValue = isFrench ? item.Gravité : item.severity;
    const typeValue = isFrench ? item.Type : item.type;
    const statusValue = isFrench ? item.Statut : item.status;
    // When coming from backend-created items, we appended consequences/causes into description.
    // Extract them so we can render with the same colors as French-format entries.
    let baseDescription = item.description || "";
    let parsedConsequences: string | null = null;
    let parsedCauses: string[] = [];

    if (!isFrench && typeof baseDescription === 'string' && baseDescription.length > 0) {
      const consMatch = baseDescription.match(/Conséquences humaines:\s*([^\n]+)/i);
      const causesMatch = baseDescription.match(/Causes principales:\s*([^\n]+)/i);

      if (consMatch) {
        parsedConsequences = consMatch[1].trim();
      }
      if (causesMatch) {
        parsedCauses = causesMatch[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Remove the lines with appended sections from the base description
      baseDescription = baseDescription
        .replace(/Conséquences humaines:.*$/im, '')
        .replace(/Causes principales:.*$/im, '')
        .trim();
    }
    return (
      <View style={[
        styles.accidentCard,
        { borderLeftColor: getSeverityColor(severityValue || ""), borderLeftWidth: 4 }
      ]}>
        <View style={styles.accidentHeader}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="event" size={16} color="#64748b" />
            <Text style={styles.accidentDate}>
              {isFrench ? item.Date_et_heure : (item.date ? formatDate(item.date) : "")}
            </Text>
          </View>
          {severityValue && (
            <View style={[styles.chip, { backgroundColor: getSeverityColor(severityValue) }]}>
              <MaterialIcons name="report" size={12} color="#fff" />
              <Text style={styles.chipText}>{getSeverityText(severityValue)}</Text>
            </View>
          )}
        </View>

        <Text style={styles.accidentTitle}>{isFrench ? item.Entreprise : item.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <MaterialIcons name="place" size={16} color="#8b5cf6" />
            <Text style={styles.accidentLocation}>{isFrench ? item.Lieu : item.location}</Text>
          </View>
          <View style={styles.metaChips}>
            {typeValue && (
              <View style={[styles.chipSoft, { backgroundColor: '#eef2ff' }]}> 
                <MaterialIcons name="category" size={12} color="#4f46e5" />
                <Text style={[styles.chipSoftText, { color: '#4f46e5' }]}>{typeValue}</Text>
              </View>
            )}
            {statusValue && (
              <View style={[styles.chipSoft, { backgroundColor: '#ecfeff' }]}> 
                <MaterialIcons name="info" size={12} color="#0891b2" />
                <Text style={[styles.chipSoftText, { color: '#0891b2' }]}>{statusValue}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.accidentDescription}>{isFrench ? item.Déroulement_de_l_accident : baseDescription}</Text>

        {isFrench && item.Produit_concerné ? (
          <View style={styles.infoRow}>
            <MaterialIcons name="science" size={16} color="#059669" />
            <Text style={styles.accidentProduct}>Produit concerné : {item.Produit_concerné}</Text>
          </View>
        ) : null}

        {(isFrench && (item.Causes_principales || []).length > 0) || (!isFrench && parsedCauses.length > 0) ? (
          <View style={styles.causesBox}>
            <Text style={styles.accidentSectionTitle}>Causes principales</Text>
            {(isFrench ? item.Causes_principales : parsedCauses).map((cause: string, idx: number) => (
              <Text key={idx} style={styles.accidentCause}>• {cause}</Text>
            ))}
          </View>
        ) : null}

        {(isFrench && item.Conséquences_humaines) || (!isFrench && parsedConsequences) ? (
          <View style={styles.highlightBox}>
            <MaterialIcons name="healing" size={16} color="#ef4444" />
            <Text style={styles.accidentConsequences}>
              Conséquences humaines : {isFrench ? item.Conséquences_humaines : parsedConsequences}
            </Text>
          </View>
        ) : null}
      </View>
    )
  }
  // Delete functionality removed

  // Safe filtering functions with null checks
  const getSevereAccidentsCount = () => {
    if (!Array.isArray(accidents)) return 0
    return accidents.filter((a) => a.Gravité === "severe" || a.Gravité === "critical").length
  }

  const getThisMonthAccidentsCount = () => {
    if (!Array.isArray(accidents)) return 0
    return accidents.filter((a) => {
      try {
        const accidentDate = new Date(a.Date_et_heure)
        const now = new Date()
        return accidentDate.getMonth() === now.getMonth() && accidentDate.getFullYear() === now.getFullYear()
      } catch (error) {
        return false
      }
    }).length
  }

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


      <View style={styles.sectionTitleContainer}>
        <MaterialIcons name="public" size={18} color="#64748b" />
        <Text style={styles.sectionTitle}>Accidents similaires dans le monde</Text>
      </View>

      <FlatList
        data={accidents}
        renderItem={renderAccident}
        keyExtractor={(item, index) => item.Identifiant || item._id || index.toString()}
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    alignSelf: "flex-end",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 4,
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaChips: {
    flexDirection: 'row',
    gap: 6,
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
  chipSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipSoftText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  accidentProduct: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  accidentConsequences: {
    fontSize: 14,
    color: "#ef4444",
    flex: 1,
  },
  accidentSectionTitle: {
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 2,
  },
  causesBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 10,
  },
  accidentCause: {
    fontSize: 13,
    color: "#f59e0b",
    marginLeft: 8,
  },
  accidentStatus: {
    fontSize: 13,
    color: "#2563eb",
    marginTop: 4,
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
