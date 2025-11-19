import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "../../contexts/authContext";
import { supabase } from "../../lib/supabase";

export default function HomeScreen() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // After signing out, navigate to the auth group (sign-in)
    // Use expo-router's replace so the user can't go back to protected screens
    router.replace('/auth');
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER IMAGE */}
      <View style={styles.headerImageContainer}>
        <Image
          source={require("@/assets/images/sleep-moon.jpg")} // replace with your own moon/sleep image
          style={styles.headerImage}
          contentFit="cover"
        />
      </View>

      {/* TITLE */}
      <ThemedText type="title" style={styles.title}>
        👋 Welcome to RestIQ
      </ThemedText>

      <ThemedText type="subtitle" style={styles.subtitle}>
        Your smart sleep companion
      </ThemedText>

      {/* USER SECTION */}
      <ThemedText style={styles.userText}>
        {user ? `Signed in as: ${user.email}` : "Loading user..."}
      </ThemedText>

      {/* NAVIGATION BUTTONS */}
      <View style={styles.buttonsContainer}>
        <Link href="/(app)/analyze" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Start Sleep Analysis</ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(app)/history" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Sleep History</ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(app)/profile" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Profile</ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/(app)/settings" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText style={styles.buttonText}>Settings</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {/* SIGN OUT BUTTON */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },

  headerImageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    opacity: 0.6,
    marginBottom: 20,
  },

  userText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    textAlign: "center",
  },

  buttonsContainer: {
    width: "100%",
    gap: 12,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#3A4460",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  signOut: {
    marginTop: "auto",
    padding: 12,
  },

  signOutText: {
    color: "#ff5252",
    fontWeight: "700",
  },
});
