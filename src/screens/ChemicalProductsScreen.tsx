"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'
import { apiService } from "../services/api"

interface ChemicalProduct {
  _id: string
  name: string
  chemicalName: string
  category: string
  hazards: string[]
  hazardClass: string
  physicalState: string
  quantity: {
    amount: number
    unit: string
  }
  location: string
  status: string
  responsiblePerson: {
    name: string
    email: string
  }
}

const categories = ["Tous", "acid", "base", "solvent", "oxidizer", "flammable", "toxic", "corrosive", "other"]

export default function ChemicalProductsScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [products, setProducts] = useState<ChemicalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchChemicalProducts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getChemicalProducts()
      // Ensure data is always an array
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching chemical products:', error)
      Alert.alert('Erreur', 'Impossible de charger les produits chimiques')
      setProducts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchChemicalProducts()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchChemicalProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.chemicalName.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDangerColor = (hazardClass: string) => {
    switch (hazardClass) {
      case "1":
      case "2":
        return "#ef4444" // Red for high danger
      case "3":
      case "4":
        return "#f59e0b" // Orange for medium danger
      case "5":
      case "6":
        return "#10b981" // Green for low danger
      default:
        return "#6b7280" // Gray for unknown
    }
  }

  const getDangerText = (hazardClass: string) => {
    switch (hazardClass) {
      case "1":
        return "Très élevé"
      case "2":
        return "Élevé"
      case "3":
        return "Moyen"
      case "4":
        return "Faible"
      case "5":
        return "Très faible"
      default:
        return "Non classé"
    }
  }

  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'acid': 'Acides',
      'base': 'Bases',
      'solvent': 'Solvants',
      'oxidizer': 'Oxydants',
      'flammable': 'Inflammables',
      'toxic': 'Toxiques',
      'corrosive': 'Corrosifs',
      'other': 'Autres'
    }
    return categoryMap[category] || category
  }

  const renderProduct = ({ item }: { item: ChemicalProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={[styles.dangerBadge, { backgroundColor: getDangerColor(item.hazardClass) }]}>
          <Text style={styles.dangerText}>{getDangerText(item.hazardClass)}</Text>
        </View>
      </View>
      <Text style={styles.productCategory}>{getCategoryText(item.category)}</Text>
      <Text style={styles.chemicalName}>{item.chemicalName}</Text>
      <View style={styles.risksContainer}>
        {(item.hazards || []).slice(0, 2).map((hazard, index) => (
          <View key={index} style={styles.riskTag}>
            <Text style={styles.riskText}>{hazard}</Text>
          </View>
        ))}
        {(item.hazards || []).length > 2 && <Text style={styles.moreRisks}>+{(item.hazards || []).length - 2} autres</Text>}
      </View>
      <View style={styles.productInfo}>
        <View style={styles.infoItem}>
          <MaterialIcons name="location-on" size={16} color="#64748b" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="science" size={16} color="#64748b" />
          <Text style={styles.infoText}>{item.physicalState}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="scale" size={16} color="#64748b" />
          <Text style={styles.infoText}>{item.quantity?.amount || 0} {item.quantity?.unit || 'unit'}</Text>
        </View>
      </View>
      <View style={styles.responsibleContainer}>
        <Text style={styles.responsibleLabel}>Responsable:</Text>
        <Text style={styles.responsibleName}>{item.responsiblePerson?.name || 'Non assigné'}</Text>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Chargement des produits chimiques...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fiches de Sécurité</Text>
        <Text style={styles.subtitle}>Produits Chimiques</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === item && styles.categoryButtonTextActive]}>
                {item === "Tous" ? "Tous" : getCategoryText(item)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="science" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>Aucun produit chimique trouvé</Text>
            <Text style={styles.emptySubtext}>
              {searchText || selectedCategory !== "Tous" 
                ? "Aucun produit ne correspond à votre recherche" 
                : "Les produits apparaîtront ici une fois ajoutés"}
            </Text>
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
  subtitle: {
    fontSize: 18,
    color: "#64748b",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  categoriesList: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  categoryButtonActive: {
    backgroundColor: "#2563eb",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  productCard: {
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
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  dangerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dangerText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productCategory: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
  },
  risksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  riskTag: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    color: "#92400e",
    fontWeight: "500",
  },
  moreRisks: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
  },
  productInfo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#64748b",
  },
  responsibleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  responsibleLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  responsibleName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  chemicalName: {
    fontSize: 14,
    color: "#64748b",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
  },
})
