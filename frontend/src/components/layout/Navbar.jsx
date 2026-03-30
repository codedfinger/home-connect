import { Link, useLocation } from "wouter";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCircle, LogOut, LayoutDashboard, Menu, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
function Navbar() {
  const { user, profile, isAuthenticated, logout, isFullyLoaded } = useAppAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const getDashboardLink = () => {
    if (!profile?.role) return "/";
    if (profile.role === "admin") return "/dashboard/admin";
    return `/dashboard/${profile.role}`;
  };
  const NavLinks = () => <>
      <Link href="/listings" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/listings" ? "text-primary" : "text-muted-foreground"}`}>
        Browse Listings
      </Link>
      <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${location === "/about" ? "text-primary" : "text-muted-foreground"}`}>
        How it Works
      </Link>
    </>;
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Shelter<span className="text-primary">NG</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          {!isFullyLoaded ? <div className="h-9 w-24 bg-muted animate-pulse rounded-full" /> : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 shadow-sm">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.profileImage || void 0} alt={user?.username || ""} />
                    <AvatarFallback className="bg-primary/5 text-primary font-medium">
                      {user?.username?.charAt(0).toUpperCase() || <UserCircle className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  {profile?.isVerified && <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      @{user?.username}
                    </p>
                    {profile?.role && <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mt-2 w-max capitalize">
                        {profile.role === "admin" ? "Admin" : profile.role}
                      </span>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full font-semibold px-4">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full shadow-md hover:shadow-lg transition-all font-semibold px-6">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {
    /* Mobile Menu */
  }
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-6 pt-12">
                <NavLinks />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>;
}
export {
  Navbar
};
