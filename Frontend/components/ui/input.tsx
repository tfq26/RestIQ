import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  inputStyle?: object;
};

export function Input({ style, inputStyle, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, style, inputStyle]}
      placeholderTextColor="#888" // substitute for placeholder:text-muted-foreground
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36, // approx h-9
    width: "100%",
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#ccc", // border-input
    borderRadius: 6, // rounded-md
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
    fontSize: 16, // text-base
    backgroundColor: "#f5f5f5", // bg-input-background
    color: "#000",
  },
});
