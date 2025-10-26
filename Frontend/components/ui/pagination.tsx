import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react-native"; // React Native compatible icons
import { Button, buttonVariants } from "./button"; // assume a RN Button component

// Container for pagination
export function Pagination({ style, children, ...props }: any) {
  return (
    <View
      {...props}
      accessibilityRole="navigation"
      accessibilityLabel="pagination"
      style={[styles.pagination, style]}
    >
      {children}
    </View>
  );
}

// Content wrapper
export function PaginationContent({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.paginationContent, style]}>
      {children}
    </View>
  );
}

// Item wrapper
export function PaginationItem({ style, children, ...props }: any) {
  return (
    <View {...props} style={style}>
      {children}
    </View>
  );
}

// Link button
export function PaginationLink({
  isActive,
  size = "icon",
  style,
  children,
  onPress,
  ...props
}: {
  isActive?: boolean;
  size?: "icon" | "default";
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      accessibilityState={{ selected: !!isActive }}
      style={[buttonVariants({ variant: isActive ? "outline" : "ghost", size }), style]}
    >
      {children}
    </Pressable>
  );
}

// Previous page button
export function PaginationPrevious({ style, onPress, ...props }: any) {
  return (
    <PaginationLink
      {...props}
      onPress={onPress}
      style={[styles.prevNextButton, style]}
    >
      <ChevronLeftIcon size={16} />
      <Text style={styles.prevNextText}>Previous</Text>
    </PaginationLink>
  );
}

// Next page button
export function PaginationNext({ style, onPress, ...props }: any) {
  return (
    <PaginationLink
      {...props}
      onPress={onPress}
      style={[styles.prevNextButton, style]}
    >
      <Text style={styles.prevNextText}>Next</Text>
      <ChevronRightIcon size={16} />
    </PaginationLink>
  );
}

// Ellipsis indicator
export function PaginationEllipsis({ style, ...props }: any) {
  return (
    <View {...props} style={[styles.ellipsis, style]}>
      <MoreHorizontalIcon size={16} />
      <Text style={styles.srOnly}>More pages</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  paginationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  prevNextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  prevNextText: {
    fontSize: 14,
  },
  ellipsis: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
  },
});
