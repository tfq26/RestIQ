import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";

/**
 * Automatically redirects the user based on whether they are authenticated.
 *
 * - If NOT logged in → redirect to (auth) group
 * - If logged in → redirect to (app) group
 */
export function useProtectedRoute() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.loading ?? true;
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (loading) return; // Don't redirect until we know the auth state

    // If the navigation tree isn't ready, we can't navigate yet.
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // User is NOT signed in, but trying to access protected screens
      // Redirect to the auth route
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // User IS signed in, but they are inside auth screens
      // Redirect to the app root (tabs)
      router.replace("/");
    }
  }, [user, loading, segments, router, rootNavigationState]);
}
