import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CheckIcon, CircleIcon, ChevronRightIcon } from "lucide-react-native";

type ContextMenuItemType = {
  key: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  onPress?: () => void;
  variant?: "default" | "destructive";
  shortcut?: string;
  subItems?: ContextMenuItemType[];
};

type ContextMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: ContextMenuItemType[];
};

export function ContextMenu({ visible, onClose, items }: ContextMenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <ScrollView>
            {items.map((item) => (
              <ContextMenuItem key={item.key} item={item} onClose={onClose} />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ContextMenuItem({
  item,
  onClose,
}: {
  item: ContextMenuItemType;
  onClose: () => void;
}) {
  const [subVisible, setSubVisible] = React.useState(false);

  const handlePress = () => {
    if (item.subItems) {
      setSubVisible(true);
    } else {
      item.onPress?.();
      onClose();
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.item,
          item.disabled && styles.itemDisabled,
          item.variant === "destructive" && styles.itemDestructive,
        ]}
        onPress={handlePress}
        disabled={item.disabled}
      >
        {item.checked && (
          <CheckIcon width={16} height={16} style={{ marginRight: 8 }} />
        )}
        <Text style={styles.itemLabel}>{item.label}</Text>
        {item.subItems && <ChevronRightIcon width={16} height={16} />}
        {item.shortcut && <Text style={styles.itemShortcut}>{item.shortcut}</Text>}
      </TouchableOpacity>

      {subVisible && item.subItems && (
        <View style={styles.subMenu}>
          {item.subItems.map((subItem) => (
            <ContextMenuItem key={subItem.key} item={subItem} onClose={onClose} />
          ))}
        </View>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    minWidth: 160,
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemDestructive: {
    backgroundColor: "#ffe5e5",
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
  },
  itemShortcut: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  subMenu: {
    marginLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "#ddd",
    paddingLeft: 8,
  },
});
