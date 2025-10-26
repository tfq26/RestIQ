import React, { useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

interface StarProps {
  size: number;
  top: number;
  left: number;
  delay: number;
  initialOpacity: number;
}

const { width, height } = Dimensions.get("window");

const Star: React.FC<StarProps> = ({ size, top, left, delay, initialOpacity }) => {
  const fadeAnim = useRef(new Animated.Value(initialOpacity)).current;

  useEffect(() => {
    const twinkle = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: initialOpacity,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    twinkle.start();
    return () => twinkle.stop();
  }, [fadeAnim, delay, initialOpacity]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          top,
          left,
          opacity: fadeAnim,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

interface StarryBackgroundProps {
  children: React.ReactNode;
}

export default function StarryBackground({ children }: StarryBackgroundProps) {
  const backgroundStars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: `bg-${i}`,
        size: Math.random() * 2 + 1,
        top: Math.random() * height,
        left: Math.random() * width,
        initialOpacity: Math.random() * 0.6 + 0.2,
        delay: Math.random() * 5000,
      })),
    []
  );

  const foregroundStars = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: `fg-${i}`,
        size: Math.random() * 1.5 + 0.5,
        top: Math.random() * height,
        left: Math.random() * width,
        initialOpacity: Math.random() * 0.8 + 0.3,
        delay: Math.random() * 5000,
      })),
    []
  );

  return (
    <View style={styles.container}>
      {/* Background stars */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {backgroundStars.map((s) => (
          // use s.id as the React key, and spread only the props we want (no `key`)
          <Star
            key={s.id}
            size={s.size}
            top={s.top}
            left={s.left}
            delay={s.delay}
            initialOpacity={s.initialOpacity}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Foreground stars */}
      <View style={[StyleSheet.absoluteFill, { zIndex: 2 }]} pointerEvents="none">
        {foregroundStars.map((s) => (
          <Star
            key={s.id}
            size={s.size}
            top={s.top}
            left={s.left}
            delay={s.delay}
            initialOpacity={s.initialOpacity}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a1a",
  },
  star: {
    position: "absolute",
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});