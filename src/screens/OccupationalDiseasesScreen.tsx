"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

interface Disease {
  id: string
  nom: string
  description: string
  symptomes: string[]
  prevention: string[]
  secteurRisque: string
}

const mockDiseases: Disease[] = [
  {
    id: "1",
    nom: "Troubles Musculo-Squelettiques (TMS)",
    description:
      "Affections touchant les muscles, tendons, nerfs, articulations, cartilages et disques intervertébraux.",
    symptomes: ["Douleurs articulaires", "Raideurs", "Perte de force", "Fourmillements"],
    prevention: ["Échauffement avant le travail", "Pauses régulières", "Ergonomie du poste", "Formation aux gestes"],
    secteurRisque: "Manutention",
  },
  {
    id: "2",
    nom: "Surdité Professionnelle",
    description: "Perte auditive causée par une exposition prolongée au bruit en milieu professionnel.",
    symptomes: ["Diminution de l'audition", "Acouphènes", "Sensation d'oreille bouchée"],
    prevention: ["Port de protections auditives", "Réduction du bruit à la source", "Contrôles audiométriques"],
    secteurRisque: "Industrie bruyante",
  },
  {
    id: "3",
    nom: "Dermatoses Professionnelles",
    description: "Affections cutanées liées à l'exposition à des substances chimiques ou irritantes.",
    symptomes: ["Rougeurs", "Démangeaisons", "Eczéma", "Brûlures cutanées"],
    prevention: ["Port de gants adaptés", "Hygiène des mains", "Éviter le contact direct"],
    secteurRisque: "Chimie",
  },
]

export default function OccupationalDiseasesScreen({ navigation }: any) {
  const [diseases] = useState<Disease[]>(mockDiseases)
  const [notifications, setNotifications] = useState<string[]>([])

  const scheduleNotification = (message: string) => {
    setNotifications((prev) => [...prev, message])
    Alert.alert("Notification programmée", message)
  }

  const renderDisease = ({ item }: { item: Disease }) => (
    <View style={styles.diseaseCard}>
      <View style={styles.diseaseHeader}>
        <Text style={styles.diseaseName}>{item.nom}</Text>
        <View style={styles.sectorBadge}>
          <Text style={styles.sectorText}>{item.secteurRisque}</Text>
        </View>
      </View>

      <Text style={styles.diseaseDescription}>{item.description}</Text>

      <View style={styles.symptomsSection}>
        <Text style={styles.sectionTitle}>Symptômes principaux:</Text>
        {item.symptomes.slice(0, 2).map((symptome, index) => (
          <Text key={index} style={styles.symptomText}>
            • {symptome}
          </Text>
        ))}
        {item.symptomes.length > 2 && (
          <Text style={styles.moreText}>+{item.symptomes.length - 2} autres symptômes</Text>
        )}
      </View>

      <View style={styles.preventionSection}>
        <Text style={styles.sectionTitle}>Prévention:</Text>
        <Text style={styles.preventionText}>• {item.prevention[0]}</Text>
        {item.prevention.length > 1 && (
          <Text style={styles.moreText}>+{item.prevention.length - 1} autres mesures</Text>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Maladies Professionnelles</Text>
        <TouchableOpacity style={styles.appointmentButton} onPress={() => navigation.navigate("Appointment")}>
          <Icon name="event" size={20} color="white" />
          <Text style={styles.appointmentButtonText}>RDV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alertSection}>
        <View style={styles.alertCard}>
          <Icon name="info" size={24} color="#2563eb" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Prochaine visite médicale</Text>
            <Text style={styles.alertText}>Pensez à programmer votre visite annuelle</Text>
          </View>
          <TouchableOpacity onPress={() => scheduleNotification("Rappel: Visite médicale dans 7 jours")}>
            <Icon name="notifications" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="local-hospital" size={24} color="#ef4444" />
          <Text style={styles.statNumber}>{diseases.length}</Text>
          <Text style={styles.statLabel}>Maladies répertoriées</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="shield" size={24} color="#10b981" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Mesures préventives</Text>
        </View>
      </View>

      <FlatList
        data={diseases}
        renderItem={renderDisease}
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
  sectorBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectorText: {
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
})
