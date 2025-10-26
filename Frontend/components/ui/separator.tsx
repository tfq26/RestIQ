import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  style?: ViewStyle;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  decorative = true, // doesn’t affect behavior in RN, included for parity
  style,
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <View
      style={[
        styles.base,
        isHorizontal ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? "no-hide-descendants" : "yes"}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#ccc", // matches 'bg-border'
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
  },
});
