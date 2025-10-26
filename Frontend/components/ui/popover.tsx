import React, { useState, ReactNode } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from "react-native";

interface PopoverProps {
  children: ReactNode;
}

interface PopoverTriggerProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

interface PopoverContentProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: object;
}

export function Popover({ children }: PopoverProps) {
  // This is just a wrapper for structure consistency
  return <>{children}</>;
}

export function PopoverTrigger({
  children,
  onPress,
}: PopoverTriggerProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}

export function PopoverContent({
  visible,
  onClose,
  children,
  style,
}: PopoverContentProps) {
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

export function PopoverAnchor({ children }: { children: ReactNode }) {
  // Anchor not really needed in RN, but included for parity
  return <>{children}</>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    minWidth: 250,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
