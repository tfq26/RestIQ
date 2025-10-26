import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: object;
}

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}


export function BreadcrumbList({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function BreadcrumbItem({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.item, style]}>{children}</View>;
}

export function BreadcrumbLink({
  label,
  onPress,
  style,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.link, style]}
    >
      <Text style={[styles.linkText, disabled && styles.linkDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({
  label,
  style,
}: {
  label: string;
  style?: object;
}) {
  return (
  <Text
    accessibilityRole="link"
    accessibilityState={{ disabled: true, selected: true }}
    style={[styles.page, style]}
  >
    {label}
  </Text>
);

}

export function BreadcrumbSeparator({ style }: { style?: object }) {
  return (
    <View style={[styles.separator, style]}>
      <ChevronRight size={14} color="#9CA3AF" />
    </View>
  );
}

export function BreadcrumbEllipsis({ style }: { style?: object }) {
  return (
    <View style={[styles.ellipsis, style]}>
      <MoreHorizontal size={16} color="#9CA3AF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    paddingHorizontal: 2,
  },
  linkText: {
    color: "#2563EB", // blue-600
    fontSize: 14,
  },
  linkDisabled: {
    color: "#9CA3AF", // gray-400
  },
  page: {
    color: "#111827", // gray-900
    fontWeight: "500",
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 4,
  },
  ellipsis: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
});
