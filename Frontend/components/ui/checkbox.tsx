import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native"; // make sure you have lucide-react-native installed

type CheckboxProps = {
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
};

function Checkbox({
  checked = false,
  onValueChange,
  disabled = false,
  style,
  ...props
}: CheckboxProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.checkbox,
        checked && styles.checked,
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => !disabled && onValueChange?.(!checked)}
      {...props}
    >
      {checked && (
        <View style={styles.indicator}>
          <Check width={14} height={14} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#3b82f6", // primary color
    borderColor: "#3b82f6",
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Checkbox };
