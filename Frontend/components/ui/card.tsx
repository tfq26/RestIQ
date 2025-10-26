import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

interface CardProps extends ViewProps {}
interface CardTextProps extends TextProps {}

// Card Container
export function Card({ style, ...props }: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

// Card Header
export function CardHeader({ style, ...props }: CardProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

// Card Title
export function CardTitle({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardTitle, style]} {...props} />;
}

// Card Description
export function CardDescription({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardDescription, style]} {...props} />;
}

// Card Action
export function CardAction({ style, ...props }: CardProps) {
  return <View style={[styles.cardAction, style]} {...props} />;
}

// Card Content
export function CardContent({ style, ...props }: CardProps) {
  return <View style={[styles.cardContent, style]} {...props} />;
}

// Card Footer
export function CardFooter({ style, ...props }: CardProps) {
  return <View style={[styles.cardFooter, style]} {...props} />;
}

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937", // bg-card
    borderRadius: 16, // rounded-xl
    borderWidth: 1,
    borderColor: "#374151", // border color
    flexDirection: "column",
    gap: 24, // gap-6
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 6, // gap-1.5
    // For layout with actions, flexDirection could be 'row' and justifyContent: 'space-between' if needed
  },
  cardTitle: {
    fontSize: 18, // adjust size for h4
    fontWeight: "600",
    lineHeight: 22,
    color: "#ffffff",
  },
  cardDescription: {
    fontSize: 14,
    color: "#9ca3af", // text-muted-foreground
  },
  cardAction: {
    position: "absolute",
    right: 24,
    top: 24,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
