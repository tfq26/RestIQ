import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { ChevronDownIcon } from "lucide-react-native"; // react-native version

// NavigationMenu root
export function NavigationMenu({ style, children, viewport = true, ...props }: any) {
  return (
    <View {...props} style={[styles.navMenu, style]}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </View>
  );
}

// List container
export function NavigationMenuList({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.navList, style]}>
      {children}
    </View>
  );
}

// Menu Item wrapper
export function NavigationMenuItem({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.navItem, style]}>
      {children}
    </View>
  );
}

// Trigger button
export function NavigationMenuTrigger({ style, children, onPress, ...props }: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.navTrigger, style]}>
      <Text>{children}</Text>
      <ChevronDownIcon size={16} style={{ marginLeft: 4 }} />
    </Pressable>
  );
}

// Content panel
export function NavigationMenuContent({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.navContent, style]}>
      <ScrollView>{children}</ScrollView>
    </View>
  );
}

// Viewport panel
export function NavigationMenuViewport({ style, children, ...props }: any) {
  return (
    <View {...props} style={[styles.navViewport, style]}>
      {children}
    </View>
  );
}

// Link item
export function NavigationMenuLink({ style, children, onPress, ...props }: any) {
  return (
    <Pressable {...props} onPress={onPress} style={[styles.navLink, style]}>
      <Text>{children}</Text>
    </Pressable>
  );
}

// Indicator (small triangle under active menu)
export function NavigationMenuIndicator({ style, ...props }: any) {
  return (
    <View {...props} style={[styles.navIndicator, style]}>
      <View style={styles.indicatorTriangle} />
    </View>
  );
}

const styles = StyleSheet.create({
  navMenu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  navItem: {
    position: "relative",
  },
  navTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  navContent: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  navViewport: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  navLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  navIndicator: {
    position: "absolute",
    top: "100%",
    left: "50%",
    width: 8,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorTriangle: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    transform: [{ rotate: "45deg" }],
  },
});

// Optional CVA style function replacement
export const navigationMenuTriggerStyle = () => ({});
