import { Link } from "wouter";
import { Home, ShieldCheck } from "lucide-react";
function Footer() {
  return <footer className="border-t border-border/40 bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Shelter<span className="text-primary">NG</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Find your perfect home without the middleman. Direct connections between verified landlords and tenants, with full transparency and trust.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 w-max px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4" />
              100% Verified Documents
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Browse Properties</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Verification Process</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} ShelterNG. All rights reserved.</p>
          <p>Designed with trust in mind.</p>
        </div>
      </div>
    </footer>;
}
export {
  Footer
};
