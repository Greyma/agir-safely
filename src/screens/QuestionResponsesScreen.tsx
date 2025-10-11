import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, Modal, Image } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { useQuestions } from "../contexts/QuestionsContext"

export default function QuestionResponsesScreen({ route, navigation }: any) {
  const { questionId } = route.params
  const { questions, addReply, deleteReply } = useQuestions() // <— include deleteReply
  const question = questions.find(q => q.id === questionId)

  const [text, setText] = useState("")
  const [imageUri, setImageUri] = useState<string | undefined>()
  const [pdf, setPdf] = useState<{ name: string; uri: string } | undefined>()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Question introuvable.</Text>
      </SafeAreaView>
    )
  }

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images })
    if (!res.canceled) setImageUri(res.assets[0].uri)
  }

  const pickPdf = async () => {
    try {
      const res: any = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
        multiple: false
      })
      if (res.canceled) return

      // Handle both legacy (res.uri) and new (res.assets[0]) shapes
      const doc = res.assets ? res.assets[0] : res
      if (!doc?.uri) return

      const name = (doc.name || "document.pdf").replace(/[/\\?%*:|"<>]/g, "_")
      setPdf({ name, uri: doc.uri })
    } catch (e) {
      Alert.alert("Erreur", "Sélection du PDF annulée")
    }
  }

  const submit = () => {
    if (!text.trim() && !imageUri && !pdf) {
      Alert.alert("Erreur", "Ajoutez une réponse (texte, image ou PDF).")
      return
    }
    addReply(question.id, { text: text.trim(), imageUri, pdf })
    setText("")
    setImageUri(undefined)
    setPdf(undefined)
  }

  const openImage = (uri: string) => setPreviewImage(uri)

  const downloadPdf = async (pdf: { name: string; uri: string }) => {
    try {
      // For local files just share (already on device)
      if (pdf.uri.startsWith("file://") || pdf.uri.startsWith("content://")) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdf.uri)
        } else {
          Alert.alert("Info", "PDF local déjà disponible.")
        }
        return
      }
      if (pdf.uri.startsWith("http://") || pdf.uri.startsWith("https://")) {
        const fileName = pdf.name.replace(/\s+/g, "_")
        const dest = FileSystem.documentDirectory + fileName
        const { uri } = await FileSystem.downloadAsync(pdf.uri, dest)
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri)
        } else {
          Alert.alert("Téléchargé", "PDF enregistré: " + uri)
        }
        return
      }
      Alert.alert("Erreur", "Type d'URI non supporté.")
    } catch (e: any) {
      console.log("PDF download/share error:", e?.message)
      Alert.alert("Erreur", "Impossible de télécharger/partager ce PDF.")
    }
  }

  const confirmDeleteReply = (replyId: string) => {
    Alert.alert(
      "Supprimer la réponse",
      "Voulez-vous supprimer cette réponse ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
            style: "destructive",
            onPress: () => deleteReply(question.id, replyId)
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.questionTitle}>{question.question}</Text>
        <Text style={styles.meta}>Anonyme • {question.replies.length} réponse(s)</Text>
      </View>

      <View style={styles.replyComposer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Votre réponse (Anonyme)..."
          multiline
          value={text}
          onChangeText={setText}
        />
        <View style={styles.attachRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
            <MaterialIcons name="image" size={20} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={pickPdf}>
            <MaterialIcons name="picture-as-pdf" size={20} color="#dc2626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={submit}>
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {(imageUri || pdf) && (
          <Text style={styles.attachPreview}>
            {imageUri ? "Image ajoutée. " : ""}{pdf ? `PDF: ${pdf.name}` : ""}
          </Text>
        )}
      </View>

      <FlatList
        data={question.replies}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        renderItem={({ item }) => (
          <View style={styles.replyCard}>
            <View style={styles.replyCardHeader}>
              <Text style={styles.replyAuthor}>Anonyme</Text>
              <TouchableOpacity
                onPress={() => confirmDeleteReply(item.id)}
                style={styles.deleteReplyBtn}
              >
                <MaterialIcons name="delete" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
            {item.text ? <Text style={styles.replyText}>{item.text}</Text> : null}
            {(item.imageUri || item.pdf) && (
              <View style={styles.attachmentsRow}>
                {item.imageUri && (
                  <TouchableOpacity
                    style={styles.attachmentBadge}
                    onPress={() => setPreviewImage(item.imageUri!)}
                  >
                    <MaterialIcons name="image" size={16} color="#2563eb" />
                    <Text style={styles.attachmentText}>Voir image</Text>
                  </TouchableOpacity>
                )}
                {item.pdf && (
                  <TouchableOpacity
                    style={[styles.attachmentBadge, styles.pdfBadge]}
                    onPress={() => downloadPdf(item.pdf!)}
                  >
                    <MaterialIcons name="picture-as-pdf" size={16} color="#dc2626" />
                    <Text style={styles.pdfAttachmentText}>PDF</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune réponse.</Text>}
      />

      {/* Image preview modal */}
      {previewImage && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setPreviewImage(null)}>
          <View style={styles.imageModalOverlay}>
            <View style={styles.imageModalContent}>
              <TouchableOpacity style={styles.imageClose} onPress={() => setPreviewImage(null)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: previewImage }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  headerBlock: { padding: 16, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#e2e8f0" },
  questionTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  meta: { fontSize: 12, color: "#64748b" },
  replyComposer: { backgroundColor: "white", margin: 16, padding: 14, borderRadius: 12 },
  replyInput: { minHeight: 80, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 10, fontSize: 14, color: "#1e293b" },
  attachRow: { flexDirection: "row", marginTop: 10, gap: 10 },
  iconBtn: { padding: 10, backgroundColor: "#eef2ff", borderRadius: 8 },
  sendBtn: { marginLeft: "auto", backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  attachPreview: { marginTop: 8, fontSize: 12, color: "#475569" },
  replyCard: { backgroundColor: "white", padding: 12, borderRadius: 10, marginBottom: 12 },
  replyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4
  },
  replyAuthor: { fontSize: 12, fontWeight: "600", color: "#2563eb", marginBottom: 4 },
  replyText: { fontSize: 14, color: "#1e293b" },
  iconsRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  empty: { textAlign: "center", color: "#64748b", marginTop: 30 },
  error: { padding: 20, color: "#dc2626" },
  attachmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  },
  attachmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0369a1'
  },
  pdfBadge: {
    backgroundColor: '#fee2e2',
  },
  pdfAttachmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  imageModalContent: {
    width: '100%',
    height: '80%'
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  imageClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6
  },
  deleteReplyBtn: {
    padding: 4,
    borderRadius: 6
  },
})