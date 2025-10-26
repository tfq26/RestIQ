import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Button Component (React Native version)
 */
export function Button({
  variant = "default",
  size = "default",
  children,
  onPress,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const containerStyle = [
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    disabled && styles.disabled,
    style,
  ];
  const labelStyle = [
    styles.textBase,
    variantTextStyles[variant],
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={containerStyle}
      activeOpacity={0.8}
    >
      <Text style={labelStyle}>{children}</Text>
    </TouchableOpacity>
  );
}

/**
 * Helper: buttonVariants()
 * Allows external components (like Pagination) to use the same visual logic.
 */
export function buttonVariants({
  variant = "default",
  size = "default",
  disabled = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}) {
  return [
    styles.base,
    variantStyles[variant],
    sizeStyles[size],
    disabled && styles.disabled,
  ];
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textBase: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});

// Variant Styles
const variantStyles: Record<ButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: "#3b82f6", // blue-500
  },
  destructive: {
    backgroundColor: "#ef4444", // red-500
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
  },
  secondary: {
    backgroundColor: "#e5e7eb", // gray-200
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
};

// Variant Text Colors
const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  default: { color: "#ffffff" },
  destructive: { color: "#ffffff" },
  outline: { color: "#111827" },
  secondary: { color: "#111827" },
  ghost: { color: "#111827" },
  link: { color: "#3b82f6", textDecorationLine: "underline" },
};

// Size Styles
const sizeStyles: Record<ButtonSize, ViewStyle> = {
  default: { height: 36, paddingHorizontal: 16 },
  sm: { height: 32, paddingHorizontal: 12 },
  lg: { height: 40, paddingHorizontal: 20 },
  icon: { width: 36, height: 36, paddingHorizontal: 0, paddingVertical: 0 },
};
