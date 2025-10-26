import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  Text,
  Animated,
} from "react-native";

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface RadioGroupItemProps {
  value: string;
  label?: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * RadioGroup – container that manages selected value
 */
export function RadioGroup({
  value,
  onValueChange,
  children,
  style,
}: RadioGroupProps) {
  return (
    <View style={[styles.group, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioGroupItemProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onSelect: onValueChange,
          });
        }
        return child;
      })}
    </View>
  );
}


/**
 * RadioGroupItem – individual radio button
 */
export function RadioGroupItem({
  value,
  label,
  selected = false,
  onSelect,
  disabled = false,
  style,
}: RadioGroupItemProps) {
  const scale = React.useRef(new Animated.Value(selected ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <Pressable
      onPress={() => !disabled && onSelect?.(value)}
      style={[styles.itemContainer, style]}
      disabled={disabled}
    >
      <View
        style={[
          styles.outerCircle,
          {
            borderColor: selected ? "#3b82f6" : "#d1d5db",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale }],
              backgroundColor: selected ? "#3b82f6" : "transparent",
            },
          ]}
        />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "column",
    gap: 12,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    color: "#111827",
  },
});
