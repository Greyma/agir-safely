import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from "react-native-vector-icons/MaterialIcons"

export default function ProductDetailScreen({ route }: any) {
  const { product } = route.params

  const precautions = [
    "Porter des gants de protection chimique",
    "Utiliser des lunettes de sécurité",
    "Travailler sous hotte aspirante",
    "Éviter tout contact avec la peau",
    "Ne pas inhaler les vapeurs",
  ]

  const equipmentRequired = [
    "Gants nitrile résistants aux produits chimiques",
    "Lunettes de sécurité étanches",
    "Blouse de laboratoire",
    "Masque respiratoire FFP2",
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.nom}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.categorie}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Niveau de Danger</Text>
          <View style={[styles.dangerIndicator, { backgroundColor: getDangerColor(product.dangerLevel) }]}>
            <Icon name="warning" size={20} color="white" />
            <Text style={styles.dangerText}>{product.dangerLevel}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pictogrammes de Sécurité</Text>
          <View style={styles.pictogramGrid}>
            {product.pictogrammes.map((picto: string, index: number) => (
              <View key={index} style={styles.pictogramCard}>
                <Text style={styles.pictogramCode}>{picto}</Text>
                <Text style={styles.pictogramDescription}>{getPictogramDescription(picto)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risques Identifiés</Text>
          {product.risques.map((risque: string, index: number) => (
            <View key={index} style={styles.riskItem}>
              <Icon name="error-outline" size={16} color="#ef4444" />
              <Text style={styles.riskText}>{risque}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Précautions d'Usage</Text>
          {precautions.map((precaution, index) => (
            <View key={index} style={styles.precautionItem}>
              <Icon name="check-circle" size={16} color="#10b981" />
              <Text style={styles.precautionText}>{precaution}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Équipement de Protection Requis</Text>
          {equipmentRequired.map((equipment, index) => (
            <View key={index} style={styles.equipmentItem}>
              <Icon name="security" size={16} color="#2563eb" />
              <Text style={styles.equipmentText}>{equipment}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.emergencyButton}>
          <Icon name="phone" size={20} color="white" />
          <Text style={styles.emergencyText}>Numéro d'urgence: 15</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function getDangerColor(level: string) {
  switch (level) {
    case "Faible":
      return "#10b981"
    case "Moyen":
      return "#f59e0b"
    case "Élevé":
      return "#ef4444"
    default:
      return "#6b7280"
  }
}

function getPictogramDescription(code: string) {
  const descriptions: { [key: string]: string } = {
    GHS02: "Inflammable",
    GHS05: "Corrosif",
    GHS06: "Toxique",
    GHS07: "Irritant",
    GHS08: "Danger pour la santé",
    GHS09: "Dangereux pour l'environnement",
  }
  return descriptions[code] || "Danger"
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
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  dangerIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  dangerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  pictogramGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  pictogramCard: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 80,
  },
  pictogramCode: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  pictogramDescription: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  riskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  riskText: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  precautionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  precautionText: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: "#1e293b",
    flex: 1,
  },
  emergencyButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  emergencyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
