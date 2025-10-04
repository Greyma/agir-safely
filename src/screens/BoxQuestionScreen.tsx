"use client"

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuestions } from "../contexts/QuestionsContext";

export default function BoxQuestionScreen({ navigation }: any) {
  const { questions, addQuestion, deleteQuestion } = useQuestions();
  const [questionText, setQuestionText] = useState("");

  const submitNew = () => {
    if (!questionText.trim()) return;
    addQuestion(questionText);
    setQuestionText("");
  };

  const openQuestion = (item: any) => {
    navigation.navigate("QuestionResponses", { questionId: item.id });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => openQuestion(item)} activeOpacity={0.85}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardQuestion}>{item.question}</Text>
        <Text style={styles.cardMeta}>Anonyme • {item.replies.length} réponse(s)</Text>
      </View>
      {!item.isDefault && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteQuestion(item.id)}>
          <MaterialIcons name="delete" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Questions anonymes</Text></View>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Posez une question..."
          value={questionText}
          onChangeText={setQuestionText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={submitNew}>
          <MaterialIcons name="send" size={18} color="white" />
          <Text style={styles.sendText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={questions}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#f1f5f9"},
  header:{ padding:16, backgroundColor:"white", borderBottomWidth:1, borderColor:"#e2e8f0"},
  title:{ fontSize:22, fontWeight:"700", color:"#1e293b"},
  inputCard:{ backgroundColor:"white", margin:16, marginBottom:8, padding:16, borderRadius:12 },
  input:{ backgroundColor:"#f8fafc", borderWidth:1, borderColor:"#e2e8f0", borderRadius:8, padding:10, minHeight:60, textAlignVertical:"top", marginBottom:10 },
  sendButton:{ alignSelf:"flex-end", flexDirection:"row", backgroundColor:"#2563eb", paddingHorizontal:14, paddingVertical:10, borderRadius:8, alignItems:"center", gap:6 },
  sendText:{ color:"white", fontWeight:"600" },
  card:{ flexDirection:"row", backgroundColor:"white", padding:14, borderRadius:12, marginBottom:12, gap:12, alignItems:"center" },
  cardQuestion:{ fontSize:15, fontWeight:"600", color:"#1e293b" },
  cardMeta:{ fontSize:12, color:"#64748b", marginTop:4 },
  deleteButton:{ backgroundColor:"#ef4444", paddingHorizontal:12, paddingVertical:8, borderRadius:8 }
});