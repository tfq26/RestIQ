import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function WeeklyTracker() {
  // Mock weekly sleep scores data
  const weeklyData = [
    { day: "Mon", score: 85, height: 75 },
    { day: "Tue", score: 78, height: 65 },
    { day: "Wed", score: 92, height: 85 },
    { day: "Thu", score: 88, height: 80 },
    { day: "Fri", score: 76, height: 60 },
    { day: "Sat", score: 94, height: 90 },
    { day: "Sun", score: 84, height: 70 },
  ];

  // Function to get gradient colors based on score
  const getScoreColors = (score: number) => {
    if (score >= 85) return ["#16a34a", "#22c55e", "#4ade80"]; // green
    if (score >= 70) return ["#ca8a04", "#eab308", "#facc15"]; // yellow
    return ["#dc2626", "#ef4444", "#f87171"]; // red
  };

  // Function to get quality text
  const getQualityText = () => {
    const avgScore =
      weeklyData.reduce((sum, d) => sum + d.score, 0) / weeklyData.length;
    if (avgScore >= 85) return "Excellent Recovery";
    if (avgScore >= 70) return "Good Recovery";
    return "Needs Improvement";
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getQualityText()}</Text>
        <Text style={styles.subtitle}>Tap for detailed weekly report</Text>
      </View>

      <View style={styles.chartRow}>
        {weeklyData.map((day, index) => (
          <View key={day.day} style={styles.barContainer}>
            <LinearGradient
              colors={getScoreColors(day.score)}
              style={[styles.bar, { height: day.height }]}
            />
            <Text style={styles.dayLabel}>{day.day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={["#16a34a", "#4ade80"]}
            style={styles.legendDot}
          />
          <Text style={styles.legendText}>85+</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={["#ca8a04", "#facc15"]}
            style={styles.legendDot}
          />
          <Text style={styles.legendText}>70-84</Text>
        </View>
        <View style={styles.legendItem}>
          <LinearGradient
            colors={["#dc2626", "#f87171"]}
            style={styles.legendDot}
          />
          <Text style={styles.legendText}>&lt;70</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  barContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 20,
    borderRadius: 12,
    marginBottom: 6,
  },
  dayLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
});
