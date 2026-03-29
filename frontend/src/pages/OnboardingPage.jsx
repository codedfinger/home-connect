import { useAppAuth } from "@/hooks/use-app-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

function dashboardPathForRole(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tenant") return "/dashboard/tenant";
  if (role === "landlord") return "/dashboard/tenant";
  return "/";
}

function OnboardingPage() {
  const { isAuthenticated, profile, isFullyLoaded } = useAppAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isFullyLoaded) return;
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    setLocation(dashboardPathForRole(profile?.role));
  }, [isFullyLoaded, isAuthenticated, profile?.role, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export { OnboardingPage as default };
