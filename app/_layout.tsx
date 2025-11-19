import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "../contexts/authContext";
import { useProtectedRoute } from "../app/auth/useProtectedRoute"

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Strip noisy RN web warnings
  if (
    typeof console !== "undefined" &&
    (console as any)._pointerEventsFilterApplied !== true
  ) {
    const originalWarn = console.warn.bind(console);
    (console as any).warn = (...args: any[]) => {
      try {
        const first = args[0];
        if (
          typeof first === "string" &&
          first.includes("props.pointerEvents is deprecated")
        ) {
          return;
        }
      } catch {}
      originalWarn(...args);
    };
    (console as any)._pointerEventsFilterApplied = true;
  }

  return (
    <AuthProvider>
      <AuthNavigationGate colorScheme={colorScheme} />
    </AuthProvider>
  );
}

function AuthNavigationGate({ colorScheme }: { colorScheme: string }) {
  // ❗ Ensure navigation is mounted BEFORE redirect logic runs.
  // This prevents "navigate before mounting" errors.
  useProtectedRoute();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
