import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface AspectRatioProps {
  ratio?: number; // e.g. 16 / 9
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function AspectRatio({ ratio = 1, style, children }: AspectRatioProps) {
  return (
    <View style={[styles.container, { aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
