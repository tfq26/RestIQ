import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

type LabelProps = TextProps & {
  labelStyle?: object;
};

export function Label({ style, labelStyle, children, ...props }: LabelProps) {
  return (
    <Text {...props} style={[styles.label, style, labelStyle]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // approximate for gap-2
    fontSize: 14, // text-sm
    lineHeight: 16, // leading-none
    fontWeight: "500", // font-medium
    userSelect: "none", // select-none equivalent
    opacity: 1, // default, can be overridden for disabled
  },
});
