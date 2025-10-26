import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

interface ScrollAreaProps {
  children: React.ReactNode;
  horizontal?: boolean;
  style?: any;
  contentContainerStyle?: any;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  horizontal = false,
  style,
  contentContainerStyle,
}) => {
  return (
    <View style={[styles.root, style]}>
      <ScrollView
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.viewport, contentContainerStyle]}
      >
        {children}
      </ScrollView>
      {/* Optional custom scrollbar track */}
      <ScrollBar orientation={horizontal ? "horizontal" : "vertical"} />
    </View>
  );
};

interface ScrollBarProps {
  orientation?: "horizontal" | "vertical";
}

export const ScrollBar: React.FC<ScrollBarProps> = ({
  orientation = "vertical",
}) => {
  return (
    <View
      style={[
        styles.scrollbar,
        orientation === "horizontal"
          ? styles.scrollbarHorizontal
          : styles.scrollbarVertical,
      ]}
    >
      <View style={styles.thumb} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "relative",
    flex: 1,
  },
  viewport: {
    flexGrow: 1,
  },
  scrollbar: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  scrollbarVertical: {
    top: 0,
    right: 2,
    width: 4,
    height: "100%",
  },
  scrollbarHorizontal: {
    left: 0,
    bottom: 2,
    height: 4,
    width: "100%",
  },
  thumb: {
    backgroundColor: "#ccc",
    borderRadius: 2,
    flex: 1,
  },
});
