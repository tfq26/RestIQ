import { Stack } from "expo-router";
import { useProtectedRoute } from "./useProtectedRoute";

export default function AuthLayout() {
  // Redirect authenticated users OUT of auth routes
  useProtectedRoute();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
