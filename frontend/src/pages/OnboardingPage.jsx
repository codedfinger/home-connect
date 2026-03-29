import { useAppAuth } from "@/hooks/use-app-auth";
import { useUpdateUserProfile } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Key, ArrowRight } from "lucide-react";
function OnboardingPage() {
  const { isAuthenticated, profile, isFullyLoaded, refetchProfile } = useAppAuth();
  const [, setLocation] = useLocation();
  const { mutate: updateProfile, isPending } = useUpdateUserProfile({
    mutation: {
      onSuccess: async (data) => {
        await refetchProfile();
        setLocation(`/dashboard/${data.role}`);
      }
    }
  });
  useEffect(() => {
    if (isFullyLoaded && !isAuthenticated) {
      setLocation("/");
    } else if (isFullyLoaded && profile?.role) {
      setLocation(`/dashboard/${profile.role}`);
    }
  }, [isFullyLoaded, isAuthenticated, profile, setLocation]);
  if (!isFullyLoaded || profile?.role) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  const handleSelect = (role) => {
    updateProfile({ data: { role } });
  };
  return <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
      {
    /* Abstract Background */
  }
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
    src={`${import.meta.env.BASE_URL}images/auth-bg.png`}
    alt="Background"
    className="w-full h-full object-cover opacity-60"
  />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="bg-white p-4 rounded-3xl shadow-xl inline-block mb-6">
              <img src={`${import.meta.env.BASE_URL}images/logo-icon.png`} alt="Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-foreground mb-4">Welcome to HomeConnect</h1>
            <p className="text-xl text-muted-foreground">To get started, tell us how you'll use the platform.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
  >
            <button
    onClick={() => handleSelect("tenant")}
    disabled={isPending}
    className="w-full text-left group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
  >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-3">I'm looking for a home</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Find verified properties, connect directly with owners, and rent or buy without paying any agency commissions.
              </p>
              <div className="flex items-center font-semibold text-primary">
                Continue as Tenant <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
  >
            <button
    onClick={() => handleSelect("landlord")}
    disabled={isPending}
    className="w-full text-left group bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20"
  >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-3">I want to list a property</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                List your properties, verify your documents to attract quality tenants, and manage everything directly.
              </p>
              <div className="flex items-center font-semibold text-primary">
                Continue as Landlord <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>;
}
export {
  OnboardingPage as default
};
