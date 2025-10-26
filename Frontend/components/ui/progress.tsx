import React from "react";
import { View, StyleSheet, Animated } from "react-native";

interface ProgressProps {
  value?: number; // 0–100
  style?: object;
  trackColor?: string;
  fillColor?: string;
  height?: number;
}

/**
 * React Native Progress Bar (Radix-style equivalent)
 */
export function Progress({
  value = 0,
  style,
  trackColor = "rgba(59,130,246,0.2)", // blue-500/20
  fillColor = "#3b82f6", // blue-500
  height = 8,
}: ProgressProps) {
  const widthAnim = React.useRef(new Animated.Value(value)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: trackColor, height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            borderRadius: height / 2,
            width: widthInterpolated,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
