import React from "react";
import { View, Text, StyleSheet } from "react-native";

type AlertVariant = "default" | "destructive";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  style?: object;
}

export function Alert({
  variant = "default",
  title,
  description,
  children,
  style,
}: AlertProps) {
  const variantStyle =
    variant === "destructive" ? styles.destructive : styles.default;

  return (
    <View style={[styles.container, variantStyle, style]}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </View>
  );
}

export function AlertTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function AlertDescription({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
  },
  default: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  destructive: {
    backgroundColor: "#ffeaea",
    borderColor: "#ff6b6b",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default Alert;
