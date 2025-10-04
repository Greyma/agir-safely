"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChemicalProduct {
  _id: string;
  name: string;
  chemicalName: string;
  category: string;
  hazards: string[];
  hazardClass: string;
  physicalState: string;
  quantity: {
    amount: number;
    unit: string;
  };
  location: string;
  status: string;
  responsiblePerson: {
    name: string;
    email: string;
  };
  pdfUrl?: string;
}

const categories = [
  "Tous",
  "acid",
  "base",
  "solvent",
  "oxidizer",
  "flammable",
  "toxic",
  "corrosive",
  "other",
];

export default function ChemicalProductsScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<ChemicalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const STORAGE_KEY = "local_chemical_products_v1";

  const generateSampleChemicals = (pdfs: any[]) => {
    const categoryMap: { [key: string]: string } = {
      "acide sulfurique": "acid",
      "acide oxalique": "acid",
      "acide tartrique": "acid",
      "acide 1-amino-2naphtol-4-sulphonique": "acid",
      "acide nitrique": "acid",
      "acide chlorhydrique": "acid",
      "acide citrique": "acid",
      "acide acétique": "acid",
      "acide phosphorique": "acid",
      "ammoniaque": "base",
      "hydroxyde de sodium": "base",
      "hydroxyde de potassium": "base",
      "hydroxyde d’ammonium": "base",
      "soude caustique": "base",
      "acétone": "solvent",
      "acetone": "solvent",
      "éthanol": "solvent",
      "ethanol": "solvent",
      "n-hexane": "solvent",
      "méthanol": "solvent",
      "methanol": "solvent",
      "chloroforme": "solvent",
      "dichlorométhane": "solvent",
      "toluène": "solvent",
      "peroxyde d’hydrogène": "oxidizer",
      "permanganate de potassium": "oxidizer",
      "nitrate d’ammonium": "oxidizer",
      "2-propanol": "flammable",
      "isopropanol": "flammable",
      "éther éthylique": "flammable",
      "chlorure d’hydroxylamine": "corrosive",
      "chlorure de sodium": "salt",
      "sulfate de cuivre": "salt",
      "nitrate d’argent": "salt",
      "cyanure de potassium": "toxic",
      "mercure": "toxic",
    };

    
    const locations = ["Stockage A", "Stockage B", "Laboratoire 1", "Laboratoire 2", "Réserve"];
    const physicalStates = ["Liquide", "Solide", "Gaz"];
    const units = ["L", "kg", "g", "mL"];
    const hazardClasses = ["1", "2", "3", "4", "5"];
    const responsiblePeople = [
      { name: "Dr. Salim", email: "salim@example.com" },
      { name: "Mme. Leila", email: "leila@example.com" },
      { name: "M. Karim", email: "karim@example.com" },
      { name: "Mme. Sara", email: "sara@example.com" },
      { name: "Non assigné", email: "" },
    ];

    return pdfs.map((pdf, idx) => {
      const key = pdf.name.toLowerCase().replace(/[-_]/g, " ").trim();
      const category = categoryMap[key] || "other";
      // Randomize fields
      const quantity = {
        amount: Math.floor(Math.random() * 100) + 1,
        unit: units[Math.floor(Math.random() * units.length)],
      };
      const location = locations[Math.floor(Math.random() * locations.length)];
      const physicalState = physicalStates[Math.floor(Math.random() * physicalStates.length)];
      const hazardClass = hazardClasses[Math.floor(Math.random() * hazardClasses.length)];
      const responsiblePerson = responsiblePeople[Math.floor(Math.random() * responsiblePeople.length)];

      return {
        _id: `chem_${idx + 1}`,
        name: pdf.name,
        chemicalName: pdf.name,
        category,
        hazards: [],
        hazardClass,
        physicalState,
        quantity,
        location,
        status: "available",
        responsiblePerson,
        pdfUrl: pdf.file,
      };
    });
  };

  const fetchChemicalProducts = async () => {
    try {
      setLoading(true);

      const samplePdfs = [
        { name: "2-Propanol", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/2propanol.pdf" },
        { name: "Acetate de sodium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acetate-de-sodium.pdf" },
        { name: "Acide 1-amino-2naphtol-4-sulphonique", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acide-1-amino-2naphtol-4-sulphonique.pdf" },
        { name: "Acide oxalique", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acide-oxalique.pdf" },
        { name: "Acide sulfurique", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acide_sulfurique.pdf" },
        { name: "Acide tartrique", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acide-tartrique.pdf" },
        { name: "Acetate d'ammonium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acetate-d-ammonium-2.pdf" },
        { name: "Acétone", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/acetone.pdf" },
        { name: "Ammoniaque", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/ammoniaque.pdf" },
        { name: "Ammonium chloride", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/ammonium-chloride.pdf" },
        { name: "Chlorure d'ammonium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/chlorure-d-ammonium.pdf" },
        { name: "Chlorure de tin dihydrate", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/chlorure-detain-dihydrate.pdf" },
        { name: "Chlorure d'hydroxyle amine", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/chlorure-d-hydroxyle-amine.pdf" },
        { name: "Chlorure de sodium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/chlorure-de-sodium.pdf" },
        { name: "Ethanol", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/ethanol.pdf" },
        { name: "Hydroxyl d'ammonium chloride", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/hydroxyl-d-ammonium-chloride.pdf" },
        { name: "LCK314 FR", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/lck314-fr-fr.pdf" },
        { name: "LCK321 FR", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/lck321-fr-fr.pdf" },
        { name: "LCK329 FR", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/lck329-fr-fr.pdf" },
        { name: "LCK341 FR", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/lck341-fr-fr.pdf" },
        { name: "n-Hexane", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/n-hexane.pdf" },
        { name: "Nana", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/nana.pdf" },
        { name: "Sulfate de sodium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/sulfate-de-sodium.pdf" },
        { name: "Zirconium", file: "https://raw.githubusercontent.com/yacinecs/pdf/main/zirconium.pdf" },
      ];

      const seed = generateSampleChemicals(samplePdfs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      setProducts(seed);
    } catch (error) {
      console.error("Error fetching chemical products:", error);
      Alert.alert("Erreur", "Impossible de charger les produits chimiques");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChemicalProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchChemicalProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.chemicalName.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDangerColor = (hazardClass: string) => {
    switch (hazardClass) {
      case "1":
      case "2":
        return "#ef4444";
      case "3":
      case "4":
        return "#f59e0b";
      case "5":
      case "6":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getDangerText = (hazardClass: string) => {
    switch (hazardClass) {
      case "1":
        return "Très élevé";
      case "2":
        return "Élevé";
      case "3":
        return "Moyen";
      case "4":
        return "Faible";
      case "5":
        return "Très faible";
      default:
        return "Non classé";
    }
  };

  const getCategoryText = (category: string) => {
    const map: { [key: string]: string } = {
      acid: "Acide",
      base: "Base",
      solvent: "Solvant",
      oxidizer: "Oxydant",
      flammable: "Inflammable",
      toxic: "Toxique",
      corrosive: "Corrosif",
      salt: "Sel",
      other: "Autre",
    };
    return map[category] || category;
  };

  const handleProductPress = (product: ChemicalProduct) => {
    if (product.pdfUrl) {
      navigation.navigate("PdfViewer", {
        pdfUrl: product.pdfUrl,
        title: product.name,
      });
    } else {
      Alert.alert("Erreur", "Aucun PDF disponible pour ce produit");
    }
  };

  const renderProduct = ({ item }: { item: ChemicalProduct }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <Text style={styles.pdfLink}>Voir le PDF</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>
            Chargement des produits chimiques...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fiche de Données et de Sécurité</Text>
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
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.categoryButtonTextActive,
                ]}
              >
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
            <Text style={styles.emptyText}>
              Aucun produit chimique trouvé
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText || selectedCategory !== "Tous"
                ? "Aucun produit ne correspond à votre recherche"
                : "Les produits apparaîtront ici une fois ajoutés"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 18, color: "#64748b" },
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
  searchInput: { flex: 1, fontSize: 16, color: "#1e293b" },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  categoriesList: { paddingHorizontal: 4 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  categoryButtonActive: { backgroundColor: "#2563eb" },
  categoryButtonText: { fontSize: 14, fontWeight: "500", color: "#64748b" },
  categoryButtonTextActive: { color: "white" },
  list: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  listContent: { paddingBottom: 16 },
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
  productName: { fontSize: 18, fontWeight: "600", color: "#1e293b", flex: 1 },
  productCategory: { fontSize: 14, color: "#64748b", marginBottom: 12 },
  chemicalName: { fontSize: 14, color: "#94a3b8", marginBottom: 8 },
  productInfo: { flexDirection: "row", gap: 12, marginBottom: 12 },
  infoItem: { flexDirection: "row", alignItems: "center" },
  infoText: { fontSize: 14, color: "#64748b" },
  responsibleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  responsibleLabel: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
  responsibleName: { fontSize: 14, color: "#64748b", marginLeft: 4 },
  pdfLink: {
    color: "#2563eb",
    fontWeight: "500",
    marginTop: 12,
    textAlign: "right",
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#64748b", fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#1e293b", marginTop: 16 },
  emptySubtext: { fontSize: 14, color: "#64748b", marginTop: 4, textAlign: "center" },
});
