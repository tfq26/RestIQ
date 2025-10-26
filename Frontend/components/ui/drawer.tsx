import * as React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
};

export function Drawer({
  visible,
  onClose,
  children,
  direction = "right",
}: DrawerProps) {
  const translateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const getTransform = () => {
    switch (direction) {
      case "left":
        return [{ translateX: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }];
      case "right":
        return [{ translateX: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }];
      case "top":
        return [{ translateY: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }];
      case "bottom":
        return [{ translateY: translateAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }];
      default:
        return [];
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: getTransform() }]}>
        {children}
      </Animated.View>
    </Modal>
  );
}

export function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

export function DrawerFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

export function DrawerTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function DrawerDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

// Styles
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawer: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "80%",
    maxHeight: "80%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    top: 0,
    bottom: 0,
    right: 0, // default to right drawer
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
