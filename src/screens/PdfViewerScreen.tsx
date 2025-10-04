"use client";

import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type PdfViewerScreenRouteProp = RouteProp<RootStackParamList, "PdfViewer">;

type Props = {
  route: PdfViewerScreenRouteProp;
};

export default function PdfViewerScreen({ route }: Props) {
  const { pdfUrl, title } = route.params;
  const [loading, setLoading] = useState(true);

  // Use Google Docs Viewer to show raw GitHub PDFs inside Expo
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    pdfUrl
  )}`;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>
            Chargement du PDF : {title}...
          </Text>
        </View>
      )}
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  webview: { flex: 1 },
});
