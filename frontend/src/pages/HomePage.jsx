import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, UserX, FileText } from "lucide-react";
import { useListProperties } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { useState } from "react";
import { motion } from "framer-motion";
function HomePage() {
  const [searchCity, setSearchCity] = useState("");
  const { data: propertiesResponse, isLoading } = useListProperties({
    query: {
      queryKey: ["home-featured-properties"]
    }
  });
  const featured = propertiesResponse?.properties?.slice(0, 3) || [];
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {
    /* Hero Section */
  }
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          {
    /* Background Image Setup using the requested AI generated image */
  }
          <div className="absolute inset-0 z-0">
            <img
    src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
    alt="Beautiful modern home exterior"
    className="w-full h-full object-cover object-center"
  />
            {
    /* Elegant gradient overlay to ensure text readability */
  }
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto px-4 md:px-6">
            <div className="max-w-2xl">
              <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4" />
                  100% Verified Landlords
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-display leading-tight mb-6 text-foreground">
                  Find Your Home.<br />
                  <span className="text-gradient">No Middlemen.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Connect directly with verified property owners. Zero agent fees, completely transparent, with legally verified land documents.
                </p>

                {
    /* Search Widget */
  }
                <div className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-xl">
                  <div className="relative flex-grow flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <input
    type="text"
    placeholder="Search by city or neighborhood..."
    className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent border-none focus:ring-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
    value={searchCity}
    onChange={(e) => setSearchCity(e.target.value)}
  />
                  </div>
                  <Link href={`/listings${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ""}`} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto rounded-xl text-base h-12 px-8 shadow-lg hover:shadow-primary/25 transition-all">
                      Search Homes
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {
    /* Value Prop Section */
  }
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Why Choose ShelterNG?</h2>
              <p className="text-muted-foreground text-lg">We've redesigned the rental and buying process to be safer, cheaper, and fully transparent.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
    {
      icon: <UserX className="w-8 h-8 text-primary" />,
      title: "Zero Agent Fees",
      desc: "Deal directly with owners. Keep the thousands you would normally pay in agency commissions."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "ID Verified Owners",
      desc: "Every landlord on our platform undergoes strict identity verification for your safety."
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      title: "Verified Documents",
      desc: "Look for the badge. We verify title deeds and land documents so you can rent or buy with confidence."
    }
  ].map((feature, i) => <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1 }}
    className="p-8 rounded-3xl bg-secondary/5 border border-border/50 hover:bg-white hover:shadow-xl transition-all duration-300"
  >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {
    /* Featured Listings */
  }
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold font-display mb-2">Featured Verified Homes</h2>
                <p className="text-muted-foreground">Handpicked properties with fully verified documents.</p>
              </div>
              <Link href="/listings" className="hidden sm:flex text-primary font-semibold hover:underline items-center gap-1">
                View all <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl" />)}
              </div> : featured.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((prop, i) => <PropertyCard key={prop.id} property={prop} index={i} />)}
              </div> : <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <p className="text-muted-foreground">No properties available at the moment.</p>
              </div>}
            
            <div className="mt-8 text-center sm:hidden">
              <Link href="/listings">
                <Button variant="outline" className="w-full rounded-xl">View all properties</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}
export {
  HomePage as default
};
