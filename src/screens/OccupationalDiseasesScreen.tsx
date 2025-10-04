"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Modal, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"

interface DiseaseSymptom {
  label: string
  score: number
}

interface Disease {
  _id: string
  name: string
  description: string
  symptoms: DiseaseSymptom[]
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

// Replace your test data with the following:
const testDiseases: Disease[] = [
  {
    _id: "1",
    name: "Polynévrite (N-Hexane)",
    description: "Polynévrite liée à l'exposition au N-Hexane.",
    symptoms: [
      { label: "Je manipule régulièrement des solvants contenant du N-Hexane", score: 1 },
      { label: "J'ai des picotements ou engourdissements dans les mains ou les pieds", score: 2 },
      { label: "J'ai une perte de sensibilité (au chaud, au froid, au toucher)", score: 2 },
      { label: "J'ai des crampes musculaires fréquentes (surtout la nuit)", score: 2 },
      { label: "J'ai une faiblesse musculaire (je lâche facilement des objets)", score: 3 },
      { label: "J'ai des difficultés à marcher ou à garder l'équilibre", score: 3 },
      { label: "Un médecin m'a déjà parlé de neuropathie ou polynévrite", score: 4 }
    ],
    riskFactors: ["Exposition au N-Hexane"],
    prevention: ["Utiliser des équipements de protection", "Limiter l'exposition"],
    treatment: ["Arrêt de l'exposition", "Suivi médical"],
    riskSector: "Industrie chimique",
    severity: "high",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "2",
    name: "Inflammations Cutanées (Chromates)",
    description: "Inflammations cutanées liées aux chromates.",
    symptoms: [
      { label: "Je manipule régulièrement des produits contenant du chromate", score: 1 },
      { label: "J'ai des rougeurs ou de l'eczéma sur la peau", score: 2 },
      { label: "J'ai des plaies ou ulcérations qui cicatrisent mal", score: 3 },
      { label: "Mes symptômes cutanés apparaissent ou s'aggravent au travail", score: 3 },
      { label: "Mes symptômes cutanés disparaissent ou s'améliorent le week-end", score: 2 },
      { label: "J'ai déjà eu un diagnostic de dermatite professionnelle", score: 4 }
    ],
    riskFactors: ["Exposition aux chromates"],
    prevention: ["Port de gants", "Hygiène de la peau"],
    treatment: ["Consultation dermatologique"],
    riskSector: "Industrie",
    severity: "medium",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "3",
    name: "Maladies Respiratoires (Chromates)",
    description: "Maladies respiratoires liées aux chromates.",
    symptoms: [
      { label: "Je travaille dans un environnement poussiéreux ou avec des fumées contenant des chromates", score: 1 },
      { label: "J'ai une toux persistante depuis plus de 3 semaines", score: 2 },
      { label: "J'ai un essoufflement inhabituel à l'effort", score: 2 },
      { label: "J'ai des irritations fréquentes du nez ou des saignements", score: 2 },
      { label: "J'ai des crises d'asthme ou des sifflements respiratoires", score: 3 },
      { label: "J'ai déjà eu un diagnostic de bronchite chronique ou de maladie respiratoire", score: 4 }
    ],
    riskFactors: ["Exposition aux chromates"],
    prevention: ["Port de masque", "Ventilation"],
    treatment: ["Consultation pneumologique"],
    riskSector: "Industrie",
    severity: "high",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "4",
    name: "Cancers liés aux Chromates",
    description: "Cancers liés à l'exposition aux chromates.",
    symptoms: [
      { label: "J'ai une exposition ancienne et prolongée aux produits contenant du chrome VI", score: 1 },
      { label: "J'ai une toux chronique depuis plusieurs mois", score: 2 },
      { label: "J'ai perdu du poids sans raison apparente", score: 3 },
      { label: "Je souffre d'une fatigue persistante", score: 2 },
      { label: "J'ai eu des saignements de nez répétés ou inhabituels", score: 2 },
      { label: "Un médecin a évoqué une suspicion de cancer professionnel", score: 4 }
    ],
    riskFactors: ["Exposition au chrome VI"],
    prevention: ["Réduction de l'exposition", "Surveillance médicale"],
    treatment: ["Consultation spécialisée"],
    riskSector: "Industrie",
    severity: "critical",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "5",
    name: "Encéphalopathie aiguë",
    description: "Encéphalopathie aiguë liée à l'exposition professionnelle.",
    symptoms: [
      { label: "J’ai des maux de tête persistants", score: 2 },
      { label: "J’ai des troubles de mémoire ou de concentration", score: 2 },
      { label: "Je me sens confus ou désorienté au travail", score: 3 },
      { label: "J’ai des troubles de l’équilibre ou des vertiges", score: 2 },
      { label: "J’ai des nausées ou vomissements inexpliqués", score: 2 },
      { label: "J’ai eu des tremblements ou des secousses involontaires", score: 3 },
      { label: "J’ai présenté des convulsions", score: 4 },
      { label: "J’ai eu une perte de connaissance ou un évanouissement", score: 4 }
    ],
    riskFactors: [],
    prevention: [],
    treatment: [],
    riskSector: "Tous",
    severity: "critical",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "6",
    name: "Anémie (Plomb)",
    description: "Anémie liée à l'exposition au plomb.",
    symptoms: [
      { label: "Je me sens fatigué même au repos", score: 2 },
      { label: "J'ai une pâleur inhabituelle (peau, lèvres)", score: 2 },
      { label: "J'ai un essoufflement rapide lors d'un effort léger", score: 2 },
      { label: "J'ai des étourdissements ou vertiges fréquents", score: 2 },
      { label: "Un médecin m'a déjà parlé d'anémie liée au plomb", score: 4 }
    ],
    riskFactors: [],
    prevention: [],
    treatment: [],
    riskSector: "Industrie",
    severity: "medium",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  },
  {
    _id: "7",
    name: "Néphropathie (Atteinte rénale due au Plomb)",
    description: "Atteinte rénale liée à l'exposition au plomb.",
    symptoms: [
      { label: "J'ai des douleurs lombaires régulières (bas du dos)", score: 2 },
      { label: "J'ai remarqué une diminution de la quantité d'urine", score: 2 },
      { label: "Mes urines sont anormales (sombres, mousseuses, sang)", score: 3 },
      { label: "J'ai les chevilles ou pieds gonflés en fin de journée", score: 2 },
      { label: "J'ai une hypertension artérielle diagnostiquée", score: 3 },
      { label: "Un médecin m'a déjà parlé d'une atteinte rénale", score: 4 }
    ],
    riskFactors: [],
    prevention: [],
    treatment: [],
    riskSector: "Industrie",
    severity: "high",
    status: "active",
    reportedBy: { name: "Médecin du travail", email: "medecin@entreprise.com" },
    reportedDate: new Date().toISOString()
  }
]

export default function OccupationalDiseasesScreen({ navigation }: any) {
  const [diseases, setDiseases] = useState<Disease[]>(testDiseases)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    setDiseases(testDiseases)
    setRefreshing(false)
  }

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

  const openDiseaseDetail = (disease: Disease) => {
    setSelectedDisease(disease)
    setModalVisible(true)
  }

  const closeDiseaseDetail = () => {
    setModalVisible(false)
    setSelectedDisease(null)
  }

  // Map for display-only symptoms in Maladies screen
  const displaySymptomsMap: { [key: string]: string[] } = {
    "Polynévrite (N-Hexane)": [
      "Picotements ou engourdissements dans les mains ou les pieds",
      "Perte de sensibilité (au chaud, au froid, au toucher)",
      "Crampes musculaires fréquentes (surtout la nuit)",
      "Faiblesse musculaire",
      "Difficultés à marcher ou à garder l'équilibre"
    ],
    "Inflammations Cutanées (Chromates)": [
      "des rougeurs ou de l'eczéma sur la peau",
      "des plaies ou ulcérations qui cicatrisent mal"
    ],
    "Maladies Respiratoires (Chromates)": [
      "une toux persistante",
      "un essoufflement inhabituel",
      "des irritations fréquentes du nez ou des saignements",
      "des crises d'asthme ou des sifflements respiratoires"
    ],
    "Cancers liés aux Chromates": [
      "une toux chronique",
      "fatigue persistante",
      "perte de poids",
      "des saignements de nez"
    ],
    "Encéphalopathie aiguë": [
      "des maux de tête",
      "des troubles de mémoire ou de concentration",
      "des troubles de l’équilibre ou des vertiges",
      "des nausées ou vomissements",
      "des tremblements ou des secousses",
      "des convulsions",
      "une perte de connaissance ou un évanouissement"
    ],
    "Anémie (Plomb)": [
      "Fatigue",
      "une pâleur inhabituelle (peau, lèvres)",
      "des étourdissements ou vertiges"
    ],
    "Néphropathie (Atteinte rénale due au Plomb)": [
      "des douleurs lombaires (bas du dos)",
      "une diminution de la quantité d'urine",
      "les chevilles ou pieds gonflés",
      "une hypertension artérielle"
    ]
  }

  const renderDisease = ({ item }: { item: Disease }) => (
    <View style={styles.diseaseCard}>
      <Text style={styles.diseaseName}>Maladie : {item.name.replace(/\s*\(.*\)/, "")}</Text>
      <Text style={styles.diseaseSymptoms}>Symptômes :</Text>
      <View style={styles.symptomList}>
        {(displaySymptomsMap[item.name] || item.symptoms.map(s => s.label)).map((symptom, idx) => (
          <Text key={idx} style={styles.symptomItem}>
            {`${idx + 1}. ${symptom}`}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => navigation.navigate("DiseaseTest", { disease: item })}
      >
        <Text style={styles.testButtonText}>Faire le test</Text>
      </TouchableOpacity>
    </View>
  )

  if (refreshing) {
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

      {/* Disease Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDiseaseDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedDisease?.name}</Text>
              <Text style={styles.modalDesc}>{selectedDisease?.description}</Text>
              <Text style={styles.modalSection}>Symptômes et scores :</Text>
              {selectedDisease?.symptoms.map((s, idx) => (
                <Text key={idx} style={styles.modalSymptom}>• {s.label} <Text style={{color:'#2563eb'}}>({s.score})</Text></Text>
              ))}
              <Text style={styles.modalSection}>Facteurs de risque :</Text>
              {selectedDisease?.riskFactors.map((rf, idx) => (
                <Text key={idx} style={styles.modalText}>- {rf}</Text>
              ))}
              <Text style={styles.modalSection}>Prévention :</Text>
              {selectedDisease?.prevention.map((p, idx) => (
                <Text key={idx} style={styles.modalText}>- {p}</Text>
              ))}
              <Text style={styles.modalSection}>Traitement :</Text>
              {selectedDisease?.treatment.map((t, idx) => (
                <Text key={idx} style={styles.modalText}>- {t}</Text>
              ))}
              <Text style={styles.modalSection}>Secteur à risque :</Text>
              <Text style={styles.modalText}>{selectedDisease?.riskSector}</Text>
              <Text style={styles.modalSection}>Gravité :</Text>
              <Text style={styles.modalText}>{getSeverityText(selectedDisease?.severity || "")}</Text>
              <Text style={styles.modalSection}>Signalé par :</Text>
              <Text style={styles.modalText}>{selectedDisease?.reportedBy?.name} ({selectedDisease?.reportedBy?.email})</Text>
              <Text style={styles.modalSection}>Date :</Text>
              <Text style={styles.modalText}>{selectedDisease?.reportedDate && formatDate(selectedDisease.reportedDate)}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeDiseaseDetail}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  diseaseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  diseaseDesc: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  diseaseSymptoms: {
    fontSize: 13,
    color: "#3b82f6",
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
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
  preventionSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
  },
  modalSection: {
    fontWeight: "bold",
    color: "#2563eb",
    marginTop: 12,
    marginBottom: 4,
  },
  modalSymptom: {
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 2,
  },
  modalText: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 2,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  symptomList: {
    marginBottom: 8,
    marginLeft: 8,
  },
  symptomItem: {
    fontSize: 13,
    color: "#3b82f6",
    marginBottom: 2,
  },
})
