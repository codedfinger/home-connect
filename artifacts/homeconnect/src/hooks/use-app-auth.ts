import { useAuth as useReplitAuth } from "@workspace/replit-auth-web";
import { useGetUserProfile } from "@workspace/api-client-react";

export function useAppAuth() {
  const auth = useReplitAuth();
  
  const { 
    data: profile, 
    isLoading: isProfileLoading,
    refetch: refetchProfile 
  } = useGetUserProfile({
    query: {
      enabled: auth.isAuthenticated,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  return {
    ...auth,
    profile,
    isFullyLoaded: !auth.isLoading && (!auth.isAuthenticated || !isProfileLoading),
    refetchProfile,
    role: profile?.role,
    isVerified: profile?.isVerified
  };
}
