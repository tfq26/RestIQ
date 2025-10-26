import * as React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CheckIcon, CircleIcon } from "lucide-react-native";

type DropdownMenuProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function DropdownMenu({ visible, onClose, children }: DropdownMenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.menuContainer}>
        <ScrollView>{children}</ScrollView>
      </View>
    </Modal>
  );
}

export function DropdownMenuItem({
  children,
  onPress,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.item,
        pressed && !disabled ? styles.itemPressed : undefined,
        disabled ? styles.itemDisabled : undefined,
      ]}
    >
      <Text>{children}</Text>
    </Pressable>
  );
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onPress,
}: {
  children: React.ReactNode;
  checked: boolean;
  onPress?: () => void;
}) {
  return (
    <DropdownMenuItem onPress={onPress}>
      <View style={styles.itemContent}>
        {checked && <CheckIcon size={16} />}
        <Text style={{ marginLeft: checked ? 8 : 0 }}>{children}</Text>
      </View>
    </DropdownMenuItem>
  );
}

export function DropdownMenuRadioItem({
  children,
  selected,
  onPress,
}: {
  children: React.ReactNode;
  selected: boolean;
  onPress?: () => void;
}) {
  return (
    <DropdownMenuItem onPress={onPress}>
      <View style={styles.itemContent}>
        {selected && <CircleIcon size={12} />}
        <Text style={{ marginLeft: selected ? 8 : 0 }}>{children}</Text>
      </View>
    </DropdownMenuItem>
  );
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function DropdownMenuSeparator() {
  return <View style={styles.separator} />;
}

// Basic styles
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  itemPressed: {
    backgroundColor: "#eee",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    padding: 8,
    fontWeight: "600",
    fontSize: 12,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
});
