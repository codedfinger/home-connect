import { useState, useEffect, useCallback, useRef } from "react";
import { useGetUserProfile } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
function useAppAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });
  const queryClient = useQueryClient();
  const fetchedRef = useRef(false);
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user", { credentials: "include" });
      const data = await res.json();
      if (data?.user) {
        setAuthState({ user: data.user, isLoading: false, isAuthenticated: true });
      } else {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchUser();
    }
  }, [fetchUser]);
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    queryClient.clear();
    setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    window.location.href = "/";
  }, [queryClient]);
  const setUser = useCallback((user) => {
    setAuthState({ user, isLoading: false, isAuthenticated: true });
  }, []);
  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = useGetUserProfile({
    query: {
      enabled: authState.isAuthenticated,
      staleTime: 1e3 * 60 * 5
    }
  });
  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    profile,
    isFullyLoaded: !authState.isLoading && (!authState.isAuthenticated || !isProfileLoading),
    refetchProfile,
    role: profile?.role,
    isVerified: profile?.isVerified,
    logout,
    setUser,
    refetch: fetchUser
  };
}
export {
  useAppAuth
};
