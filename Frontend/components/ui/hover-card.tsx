import React, { useState } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";

type HoverCardProps = {
  children: React.ReactNode;
};

type HoverCardTriggerProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
};

type HoverCardContentProps = {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  style?: object;
};

export function HoverCard({ children }: HoverCardProps) {
  return <View>{children}</View>;
}

export function HoverCardTrigger({
  children,
  onPress,
}: HoverCardTriggerProps) {
  return <Pressable onPress={onPress}>{children}</Pressable>;
}

export function HoverCardContent({
  children,
  visible,
  onClose,
  style,
}: HoverCardContentProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, style]}>{children}</View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 256, // w-64 in Tailwind
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
});
