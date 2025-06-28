"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

interface Intervention {
  id: string
  date: string
  technicien: string
  type: string
  description: string
  duree: string
}

const mockInterventions: Intervention[] = [
  {
    id: "1",
    date: "15/06/2024",
    technicien: "Jean Dupont",
    type: "Maintenance préventive",
    description: "Vérification générale et nettoyage des composants",
    duree: "2h30",
  },
  {
    id: "2",
    date: "10/05/2024",
    technicien: "Marie Martin",
    type: "Réparation",
    description: "Remplacement du capteur de température défaillant",
    duree: "1h15",
  },
]

export default function EquipmentDetailScreen({ route }: any) {
  const { equipment } = route.params
  const [interventions, setInterventions] = useState<Intervention[]>(mockInterventions)
  const [showInterventionModal, setShowInterventionModal] = useState(false)
  const [newIntervention, setNewIntervention] = useState({
    technicien: "",
    type: "",
    description: "",
    duree: "",
  })

  const addIntervention = () => {
    setShowInterventionModal(true)
  }

  const saveIntervention = () => {
    if (!newIntervention.technicien || !newIntervention.type || !newIntervention.description || !newIntervention.duree) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    const intervention: Intervention = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      technicien: newIntervention.technicien,
      type: newIntervention.type,
      description: newIntervention.description,
      duree: newIntervention.duree,
    }

    setInterventions([intervention, ...interventions])
    setNewIntervention({ technicien: "", type: "", description: "", duree: "" })
    setShowInterventionModal(false)
    
    Alert.alert("Succès", "Nouvelle intervention ajoutée avec succès")
  }

  const generateReport = async () => {
    const report = `
RAPPORT DE MAINTENANCE - ${equipment.nom}

Équipement: ${equipment.nom}
Type: ${equipment.type}
Zone: ${equipment.zone}
État actuel: ${equipment.etat}

Dernière maintenance: ${equipment.derniereMaintenance}
Prochaine maintenance: ${equipment.prochaineMaintenance}

INTERVENTIONS RÉCENTES:
${interventions.map(int => `
- ${int.date} | ${int.type}
  Technicien: ${int.technicien}
  Description: ${int.description}
  Durée: ${int.duree}
`).join('')}

Total interventions: ${interventions.length}
    `.trim()

    try {
      const fileName = `rapport_maintenance_${equipment.nom?.replace(/\s+/g, '_') || 'equipement'}.txt`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      // Save the file temporarily
      await FileSystem.writeAsStringAsync(fileUri, report, { encoding: FileSystem.EncodingType.UTF8 });

      // Immediately share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Partager le rapport de maintenance'
        });
      } else {
        Alert.alert('Partage non disponible', 'Impossible de partager ce fichier sur cet appareil.');
      }
    } catch (e) {
      console.error('Error generating report:', e);
      Alert.alert("Erreur", "Impossible de générer le rapport.")
    }
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.equipmentInfo}>
            <Text style={styles.equipmentName}>{equipment.nom}</Text>
            <Text style={styles.equipmentType}>{equipment.type}</Text>
            <Text style={styles.equipmentZone}>{equipment.zone}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(equipment.etat) }]}>
            <MaterialIcons name={getStatusIcon(equipment.etat)} size={16} color="white" />
            <Text style={styles.statusText}>{equipment.etat}</Text>
          </View>
        </View>

        <View style={styles.maintenanceCard}>
          <Text style={styles.cardTitle}>Informations de Maintenance</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dernière maintenance:</Text>
            <Text style={styles.infoValue}>{equipment.derniereMaintenance}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prochaine maintenance:</Text>
            <Text style={[styles.infoValue, equipment.alerteActive && styles.infoValueAlert]}>
              {equipment.prochaineMaintenance}
            </Text>
          </View>
          {equipment.alerteActive && (
            <View style={styles.alertSection}>
              <MaterialIcons name="warning" size={16} color="#f59e0b" />
              <Text style={styles.alertText}>Maintenance requise bientôt</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions Rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={addIntervention}>
              <MaterialIcons name="add" size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Nouvelle intervention</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={generateReport}>
              <MaterialIcons name="description" size={20} color="#2563eb" />
              <Text style={styles.actionButtonText}>Générer rapport</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.cardTitle}>Historique des Interventions</Text>
            <Text style={styles.historyCount}>{(interventions || []).length} interventions</Text>
          </View>

          {(interventions || []).map((intervention) => (
            <View key={intervention.id} style={styles.interventionItem}>
              <View style={styles.interventionHeader}>
                <Text style={styles.interventionDate}>{intervention.date}</Text>
                <View style={styles.interventionTypeBadge}>
                  <Text style={styles.interventionTypeText}>{intervention.type}</Text>
                </View>
              </View>
              <Text style={styles.interventionTechnicien}>Technicien: {intervention.technicien}</Text>
              <Text style={styles.interventionDescription}>{intervention.description}</Text>
              <View style={styles.interventionFooter}>
                <View style={styles.durationContainer}>
                  <MaterialIcons name="schedule" size={14} color="#64748b" />
                  <Text style={styles.interventionDuration}>{intervention.duree}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.specificationsCard}>
          <Text style={styles.cardTitle}>Spécifications Techniques</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Modèle:</Text>
            <Text style={styles.specValue}>XYZ-2024</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Numéro de série:</Text>
            <Text style={styles.specValue}>SN123456789</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Date d'installation:</Text>
            <Text style={styles.specValue}>15/03/2023</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Garantie:</Text>
            <Text style={styles.specValue}>Jusqu'au 15/03/2025</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal pour nouvelle intervention */}
      <Modal
        visible={showInterventionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInterventionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Intervention</Text>
              <TouchableOpacity onPress={() => setShowInterventionModal(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Technicien *</Text>
              <TextInput
                style={styles.formInput}
                value={newIntervention.technicien}
                onChangeText={(text) => setNewIntervention({...newIntervention, technicien: text})}
                placeholder="Nom du technicien"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Type d'intervention *</Text>
              <TextInput
                style={styles.formInput}
                value={newIntervention.type}
                onChangeText={(text) => setNewIntervention({...newIntervention, type: text})}
                placeholder="Ex: Maintenance préventive, Réparation, Inspection"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={styles.formTextArea}
                value={newIntervention.description}
                onChangeText={(text) => setNewIntervention({...newIntervention, description: text})}
                placeholder="Décrivez l'intervention effectuée..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Durée *</Text>
              <TextInput
                style={styles.formInput}
                value={newIntervention.duree}
                onChangeText={(text) => setNewIntervention({...newIntervention, duree: text})}
                placeholder="Ex: 2h30, 45min"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowInterventionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={saveIntervention}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  equipmentType: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 2,
  },
  equipmentZone: {
    fontSize: 16,
    color: "#64748b",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  maintenanceCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  infoValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  infoValueAlert: {
    color: "#ef4444",
  },
  alertSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  alertText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  actionsCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  historyCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  historyCount: {
    fontSize: 14,
    color: "#64748b",
  },
  interventionItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
    paddingLeft: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  interventionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  interventionDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  interventionTypeBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  interventionTypeText: {
    fontSize: 12,
    color: "#1d4ed8",
    fontWeight: "500",
  },
  interventionTechnicien: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  interventionDescription: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 18,
    marginBottom: 8,
  },
  interventionFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  interventionDuration: {
    fontSize: 12,
    color: "#64748b",
  },
  specificationsCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  specValue: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
  },
  formTextArea: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    height: 100,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
})
