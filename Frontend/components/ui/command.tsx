import * as React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SearchIcon } from "lucide-react-native"; // Use a RN-compatible icon library

type CommandItemType = {
  key: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onPress?: () => void;
};

type CommandDialogProps = {
  visible: boolean;
  title?: string;
  description?: string;
  items: CommandItemType[];
  onClose: () => void;
};

export function CommandDialog({
  visible,
  title = "Command Palette",
  description = "Search for a command to run...",
  items,
  onClose,
}: CommandDialogProps) {
  const [query, setQuery] = React.useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!visible) return null;

  return (
    <View style={styles.dialogOverlay}>
      <View style={styles.dialogContent}>
        <Text style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogDescription}>{description}</Text>

        <View style={styles.inputWrapper}>
          <SearchIcon width={16} height={16} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Type a command..."
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.key}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={item.onPress}
              disabled={item.disabled}
              style={[
                styles.item,
                item.disabled && styles.itemDisabled,
              ]}
            >
              <Text style={styles.itemLabel}>{item.label}</Text>
              {item.shortcut && (
                <Text style={styles.itemShortcut}>{item.shortcut}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  dialogTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  dialogDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
    color: "#888",
  },
  input: {
    flex: 1,
    height: "100%",
  },
  list: {
    flexGrow: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemLabel: {
    fontSize: 14,
  },
  itemShortcut: {
    fontSize: 12,
    color: "#666",
  },
});
