import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";

import { MinusIcon } from "lucide-react-native"; // or any RN vector icon library

type InputOTPProps = {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
  containerStyle?: object;
  inputStyle?: object;
};

export function InputOTP({
  value,
  onChangeText,
  length = 6,
  containerStyle,
  inputStyle,
}: InputOTPProps) {
  const inputs = Array.from({ length }).map(() => useRef<TextInput>(null));
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleChange = (text: string, index: number) => {
    const newValue =
      value.substring(0, index) + text.charAt(0) + value.substring(index + 1);
    onChangeText(newValue);
    if (text && index < length - 1) {
      inputs[index + 1].current?.focus();
      setFocusedIndex(index + 1);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={inputs[index]}
          style={[
            styles.input,
            focusedIndex === index && styles.inputActive,
            inputStyle,
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={value[index] ?? ""}
          onFocus={() => setFocusedIndex(index)}
          onChangeText={(text) => handleChange(text, index)}
        />
      ))}
    </View>
  );
}

export function InputOTPGroup({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function InputOTPSlot({
  char,
  isActive,
}: {
  char: string;
  isActive?: boolean;
}) {
  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  return (
    <View style={[styles.slot, isActive && styles.slotActive]}>
      <Text>{char}</Text>
      {isActive && (
        <Animated.View
          style={[
            styles.caret,
            { opacity: blinkAnim },
          ]}
        />
      )}
    </View>
  );
}

export function InputOTPSeparator() {
  return (
    <View style={styles.separator}>
      <MinusIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    borderRadius: 4,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  inputActive: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  group: {
    flexDirection: "row",
    gap: 4,
  },
  slot: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  slotActive: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  caret: {
    position: "absolute",
    width: 2,
    height: "70%",
    backgroundColor: "#000",
    left: "50%",
    transform: [{ translateX: -1 }],
  },
  separator: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
