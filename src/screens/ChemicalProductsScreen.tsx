"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialIcons } from '@expo/vector-icons'

interface ChemicalProduct {
  id: string
  nom: string
  categorie: string
  risques: string[]
  pictogrammes: string[]
  dangerLevel: "Faible" | "Moyen" | "Élevé"
}

const mockProducts: ChemicalProduct[] = [
  {
    id: "1",
    nom: "Acide Sulfurique",
    categorie: "Acides",
    risques: ["Corrosif", "Irritant", "Dangereux pour l'environnement"],
    pictogrammes: ["GHS05", "GHS07", "GHS09"],
    dangerLevel: "Élevé",
  },
  {
    id: "2",
    nom: "Éthanol",
    categorie: "Solvants",
    risques: ["Inflammable", "Irritant"],
    pictogrammes: ["GHS02", "GHS07"],
    dangerLevel: "Moyen",
  },
  {
    id: "3",
    nom: "Ammoniaque",
    categorie: "Bases",
    risques: ["Corrosif", "Toxique", "Dangereux pour l'environnement"],
    pictogrammes: ["GHS05", "GHS06", "GHS09"],
    dangerLevel: "Élevé",
  },
  {
    id: "4",
    nom: "Détergent industriel",
    categorie: "Nettoyants",
    risques: ["Irritant"],
    pictogrammes: ["GHS07"],
    dangerLevel: "Faible",
  },
]

const categories = ["Tous", "Acides", "Bases", "Solvants", "Nettoyants"]

export default function ChemicalProductsScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [products] = useState<ChemicalProduct[]>(mockProducts)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nom.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === "Tous" || product.categorie === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDangerColor = (level: string) => {
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

  const renderProduct = ({ item }: { item: ChemicalProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.nom}</Text>
        <View style={[styles.dangerBadge, { backgroundColor: getDangerColor(item.dangerLevel) }]}>
          <Text style={styles.dangerText}>{item.dangerLevel}</Text>
        </View>
      </View>
      <Text style={styles.productCategory}>{item.categorie}</Text>
      <View style={styles.risksContainer}>
        {item.risques.slice(0, 2).map((risque, index) => (
          <View key={index} style={styles.riskTag}>
            <Text style={styles.riskText}>{risque}</Text>
          </View>
        ))}
        {item.risques.length > 2 && <Text style={styles.moreRisks}>+{item.risques.length - 2} autres</Text>}
      </View>
      <View style={styles.pictogramContainer}>
        {item.pictogrammes.map((picto, index) => (
          <View key={index} style={styles.pictogram}>
            <Text style={styles.pictogramText}>{picto}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produits Chimiques</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un produit..."
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === item && styles.categoryButtonTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
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
  pictogramContainer: {
    flexDirection: "row",
    gap: 8,
  },
  pictogram: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pictogramText: {
    fontSize: 12,
    color: "#1d4ed8",
    fontWeight: "600",
  },
})
