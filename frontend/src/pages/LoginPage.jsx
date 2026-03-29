import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Home, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppAuth } from "@/hooks/use-app-auth";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required")
});
function LoginPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAppAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Login failed. Please try again.");
        return;
      }
      setUser(json.user);
      const pr = await fetch("/api/users/profile", { credentials: "include" });
      if (pr.ok) {
        const prof = await pr.json();
        if (prof.role === "admin") navigate("/dashboard/admin");
        else navigate("/dashboard/tenant");
      } else {
        navigate("/dashboard/tenant");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };
  return <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/images/hero-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 text-white max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white/20 p-2 rounded-xl">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">HomeConnect</span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Find Your Home.<br />No Middlemen.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Connect directly with verified landlords. Zero agent fees, transparent pricing, legally verified land documents.
          </p>
          <div className="mt-10 space-y-4">
            {[
    "\u2713 ID-verified property owners",
    "\u2713 Land documents checked",
    "\u2713 Direct landlord contact",
    "\u2713 No hidden agent fees"
  ].map((point) => <p key={point} className="text-white/90 font-medium">{point}</p>)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Home<span className="text-primary">Connect</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-sm">
                {serverError}
              </div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    className="h-11"
    {...register("email")}
  />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className="h-11 pr-10"
    {...register("password")}
  />
                <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-6 text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>;
}
export {
  LoginPage as default
};
