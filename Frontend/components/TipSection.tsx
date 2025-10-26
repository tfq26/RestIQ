import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Lightbulb } from "lucide-react-native";

export default function TipSection() {
  const tips = [
    "Lower your screen brightness 1 hour before bed",
    "Keep your bedroom temperature between 60-67°F",
    "Avoid caffeine 6 hours before bedtime",
    "Try the 4-7-8 breathing technique for better sleep",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(76,29,149,0.4)", "rgba(30,64,175,0.4)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBox}
      >
        <View style={styles.row}>
          <LinearGradient
            colors={["#facc15", "#fb923c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconWrapper}
          >
            <Lightbulb size={18} color="black" />
          </LinearGradient>

          <View style={styles.textWrapper}>
            <Text style={styles.tipTitle}>Sleep Tip</Text>
            <Text style={styles.tipText}>{randomTip}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  gradientBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  tipTitle: {
    color: "#facc15",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  tipText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
});
