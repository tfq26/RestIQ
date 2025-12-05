import { useAuth } from "@/contexts/authContext";
import { createURL } from "expo-linking";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from 'react-native-toast-message';
import { supabase } from "../../lib/supabase";

WebBrowser.maybeCompleteAuthSession(); // Required for web browser redirect

export default function SignInScreen() {
  const { loginAsGuest } = useAuth()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: error.message,
      });
      setLoading(false);
    }
    // If successful, the auth state listener in _layout will handle the redirect
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = createURL('/auth/callback');
      console.log('Google Sign-In Redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success' && result.url) {
          const params = new URLSearchParams(result.url.split('#')[1]);
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          }
        }
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign In Error',
        text2: err.message,
      });
    }
  };

  const handleDemoLogin = async (testMode: boolean) => {
    try {
      // Reset backend sleep score to 50 for demo
      try {
        await fetch('http://192.168.5.146:8000/reset-score', { method: 'POST' });
      } catch (e) {
        console.log("Backend not reachable, skipping score reset");
      }

      await loginAsGuest(testMode);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to enter demo mode");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Text style={styles.title}>RestIQ</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9BA9CE"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9BA9CE"
            secureTextEntry
            style={styles.input}
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
          >
            <Text style={[styles.buttonText, styles.googleButtonText]}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.demoButton]}
            onPress={() => handleDemoLogin(false)}
          >
            <Text style={[styles.buttonText, styles.demoButtonText]}>Demo Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.demoButton, { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.1)' }]}
            onPress={() => handleDemoLogin(true)}
          >
            <Text style={[styles.buttonText, styles.demoButtonText, { color: '#9BA9CE' }]}>Test Mode</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Link href="/auth/sign-up" style={styles.link}>
              Don&apos;t have an account? <Text style={styles.bold}>Create one</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1B2A",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#E0E6F5",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#9BA9CE",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: "white",
    marginTop: 16,
  },
  googleButtonText: {
    color: "#333",
  },
  demoButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  demoButtonText: {
    color: "#E0E6F5",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    color: "#9BA9CE",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    color: "#9BA9CE",
    fontSize: 14,
  },
  bold: {
    fontWeight: "700",
    color: "#3b82f6",
  },
});
