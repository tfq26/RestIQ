import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Badge Component (React Native version)
 * Equivalent to Radix UI Badge with variant support
 */
export function Badge({
  variant = "default",
  label,
  style,
  textStyle,
}: BadgeProps) {
  const containerStyle = [
    styles.base,
    variantStyles[variant],
    style,
  ];
  const labelStyle = [
    styles.textBase,
    variantTextStyles[variant],
    textStyle,
  ];

  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  textBase: {
    fontSize: 12,
    fontWeight: "500",
  },
});

const variantStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: "#3b82f6", // primary blue
    borderColor: "transparent",
  },
  secondary: {
    backgroundColor: "#e5e7eb", // gray-200
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor: "#ef4444", // red-500
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#9ca3af", // gray-400
  },
};

const variantTextStyles: Record<string, TextStyle> = {
  default: { color: "#fff" },
  secondary: { color: "#111827" },
  destructive: { color: "#fff" },
  outline: { color: "#111827" },
};
