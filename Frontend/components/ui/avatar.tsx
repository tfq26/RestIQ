import React from "react";
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle, TextStyle } from "react-native";

interface AvatarProps {
  uri?: string;
  size?: number;
  fallback?: string; // initials or emoji
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

export function Avatar({
  uri,
  size = 40,
  fallback,
  style,
  imageStyle,
  textStyle,
}: AvatarProps) {
  const [isLoaded, setIsLoaded] = React.useState(true);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {isLoaded && uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { borderRadius: size / 2 }, imageStyle]}
          onError={() => setIsLoaded(false)}
        />
      ) : (
        <View style={[styles.fallback, { borderRadius: size / 2 }]}>
          <Text style={[styles.fallbackText, textStyle]}>{fallback}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    backgroundColor: "#e5e7eb", // muted gray background
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151", // dark gray text
  },
});
