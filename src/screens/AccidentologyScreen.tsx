"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

interface Accident {
  id: string
  date: string
  lieu: string
  description: string
  gravite: "Faible" | "Moyenne" | "Élevée"
}

const mockAccidents: Accident[] = [
  {
    id: "1",
    date: "2024-01-15",
    lieu: "Atelier A - Zone de découpe",
    description: "Coupure mineure à la main droite lors de la manipulation d'une pièce métallique",
    gravite: "Faible",
  },
  {
    id: "2",
    date: "2024-01-10",
    lieu: "Entrepôt B - Allée 3",
    description: "Chute de cartons depuis une étagère haute, contusion à l'épaule",
    gravite: "Moyenne",
  },
  {
    id: "3",
    date: "2024-01-05",
    lieu: "Zone de production - Ligne 2",
    description: "Projection de liquide chimique, brûlure légère au bras",
    gravite: "Moyenne",
  },
]

export default function AccidentologyScreen({ navigation }: any) {
  const [accidents, setAccidents] = useState<Accident[]>(mockAccidents)

  const getGravityColor = (gravite: string) => {
    switch (gravite) {
      case "Faible":
        return "#10b981"
      case "Moyenne":
        return "#f59e0b"
      case "Élevée":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const showLocationMap = () => {
    Alert.alert("Cartographie", "Fonctionnalité de cartographie en développement")
  }

  const renderAccident = ({ item }: { item: Accident }) => (
    <View style={styles.accidentCard}>
      <View style={styles.accidentHeader}>
        <Text style={styles.accidentDate}>{item.date}</Text>
        <View style={[styles.gravityBadge, { backgroundColor: getGravityColor(item.gravite) }]}>
          <Text style={styles.gravityText}>{item.gravite}</Text>
        </View>
      </View>
      <Text style={styles.accidentLocation}>{item.lieu}</Text>
      <Text style={styles.accidentDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.mapButton} onPress={showLocationMap}>
        <Icon name="location-on" size={16} color="#2563eb" />
        <Text style={styles.mapButtonText}>Voir sur la carte</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accidentologies</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddAccident")}>
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{accidents.length}</Text>
          <Text style={styles.statLabel}>Total accidents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{accidents.filter((a) => a.gravite === "Élevée").length}</Text>
          <Text style={styles.statLabel}>Graves</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Ce mois</Text>
        </View>
      </View>

      <FlatList
        data={accidents}
        renderItem={renderAccident}
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
})
