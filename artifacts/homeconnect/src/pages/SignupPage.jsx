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
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
function SignupPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAppAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema)
  });
  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName
        })
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Sign up failed. Please try again.");
        return;
      }
      setUser(json.user);
      navigate("/onboarding");
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
            Join thousands finding homes without agents.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Whether you're a landlord listing your property or a tenant searching for your next home — HomeConnect gets you there directly.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
    { label: "Active Listings", value: "2,400+" },
    { label: "Verified Landlords", value: "800+" },
    { label: "Cities Covered", value: "30+" },
    { label: "Agent Fees Saved", value: "\u20A60" }
  ].map((stat) => <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-sm mt-1">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">Home<span className="text-primary">Connect</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-2">Join HomeConnect and start browsing verified properties</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-sm">
                {serverError}
              </div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="John" className="h-11" {...register("firstName")} />
                {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Doe" className="h-11" {...register("lastName")} />
                {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="h-11" {...register("email")} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="At least 6 characters"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
    id="confirmPassword"
    type={showPassword ? "text" : "password"}
    placeholder="Repeat your password"
    className="h-11"
    {...register("confirmPassword")}
  />
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center mt-6 text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>;
}
export {
  SignupPage as default
};
