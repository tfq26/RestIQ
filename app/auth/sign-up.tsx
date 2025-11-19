import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { Link, useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.replace("/"); // Return to sign-in
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>
        Create Account
      </Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 12,
        }}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 18,
        }}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#10b981",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleSignUp}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
      </TouchableOpacity>

      <Link href="/" style={{ marginTop: 20, textAlign: "center" }}>
        Already have an account? Sign In
      </Link>
    </View>
  );
}
