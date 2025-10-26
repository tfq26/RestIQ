import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AlertDialogProps {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode; // optional trigger
}

export default function AlertDialog({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
}: AlertDialogProps) {
  const [visible, setVisible] = useState(false);
  const scaleAnim = new Animated.Value(0.9);
  const opacityAnim = new Animated.Value(0);

  const open = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const handleConfirm = () => {
    onConfirm?.();
    close();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
  };

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity activeOpacity={0.8} onPress={open}>
        {children || <Text style={styles.triggerText}>Open Dialog</Text>}
      </TouchableOpacity>

      {/* Dialog */}
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={close}
      >
        <Animated.View
          style={[styles.overlay, { opacity: opacityAnim }]}
        ></Animated.View>

        <View style={styles.centerContainer}>
          <Animated.View
            style={[
              styles.dialog,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerText: {
    color: "#60a5fa",
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
  },
  cancelText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
