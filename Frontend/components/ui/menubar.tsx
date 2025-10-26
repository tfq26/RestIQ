import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react-native"; // react-native version

// Menubar container
export function Menubar({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.menubar, style]}>
      {children}
    </View>
  );
}

// Menubar Menu
export function MenubarMenu({ style, children, ...props }: any) {
  return (
    <View {...props} style={style}>
      {children}
    </View>
  );
}

// Menubar Group
export function MenubarGroup({ style, children, ...props }: any) {
  return (
    <View {...props} style={style}>
      {children}
    </View>
  );
}

// Menubar Trigger
export function MenubarTrigger({ style, children, onPress, ...props }: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.trigger, style]}>
      {children}
    </Pressable>
  );
}

// Menubar Item
export function MenubarItem({
  style,
  children,
  inset,
  variant = "default",
  onPress,
  disabled,
  ...props
}: any) {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.item,
        inset && styles.itemInset,
        variant === "destructive" && styles.itemDestructive,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

// Menubar Checkbox Item
export function MenubarCheckboxItem({
  style,
  children,
  checked,
  onPress,
  ...props
}: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.item, style]}>
      {checked && <CheckIcon size={16} />}
      <Text style={{ marginLeft: 8 }}>{children}</Text>
    </Pressable>
  );
}

// Menubar Radio Item
export function MenubarRadioItem({ style, children, selected, onPress, ...props }: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.item, style]}>
      {selected && <CircleIcon size={12} />}
      <Text style={{ marginLeft: 8 }}>{children}</Text>
    </Pressable>
  );
}

// Menubar SubTrigger
export function MenubarSubTrigger({ style, children, onPress, ...props }: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.item, style]}>
      <Text>{children}</Text>
      <ChevronRightIcon size={16} />
    </Pressable>
  );
}

// Menubar SubContent / Content
export function MenubarSubContent({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.subContent, style]}>
      <ScrollView>{children}</ScrollView>
    </View>
  );
}

// Separator
export function MenubarSeparator({ style, ...props }: any) {
  return <View {...props} style={[styles.separator, style]} />;
}

// Shortcut
export function MenubarShortcut({ style, children, ...props }: any) {
  return (
    <Text {...props} style={[styles.shortcut, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  menubar: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  trigger: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  itemInset: {
    paddingLeft: 16,
  },
  itemDestructive: {
    color: "red",
  },
  subContent: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#888",
  },
});
