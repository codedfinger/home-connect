import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListProperties } from "@workspace/api-client-react";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useLocation } from "wouter";
function ListingsPage() {
  const [loc] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState("any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const { data, isLoading } = useListProperties({
    query: {
      queryKey: ["properties", city, type, verifiedOnly]
    }
  }, {
    query: {
      // mapping our local state to the API parameters
      queryKey: ["properties", city, type, verifiedOnly],
      queryFn: () => {
        return fetch("/api").then((r) => r.json());
      }
    }
  });
  const { data: realData, isLoading: realIsLoading } = useListProperties(
    {
      city: city || void 0,
      type: type !== "any" ? type : void 0,
      verified: verifiedOnly ? true : void 0
    }
  );
  const properties = realData?.properties || [];
  return <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />
      
      {
    /* Search Header */
  }
      <div className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-grow w-full max-w-2xl flex gap-2">
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
    placeholder="City or Neighborhood..."
    className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:bg-white"
    value={city}
    onChange={(e) => setCity(e.target.value)}
  />
              </div>
              <Select value={type} onValueChange={(v) => setType(v)}>
                <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/50 border-transparent focus:bg-white">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Type</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Switch
    id="verified-mode"
    checked={verifiedOnly}
    onCheckedChange={setVerifiedOnly}
  />
                <Label htmlFor="verified-mode" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                  Verified Only
                </Label>
              </div>
              <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 md:hidden">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display text-foreground">
            {properties.length} {properties.length === 1 ? "Property" : "Properties"} Found
          </h1>
          {city && <p className="text-muted-foreground">Showing results in "{city}"</p>}
        </div>

        {realIsLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-96 bg-muted/50 animate-pulse rounded-2xl" />)}
          </div> : properties.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((prop, i) => <PropertyCard key={prop.id} property={prop} index={i} />)}
          </div> : <div className="text-center py-32 bg-white rounded-3xl border border-border/50 shadow-sm max-w-2xl mx-auto">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-display mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search for a different area.</p>
            <Button variant="outline" onClick={() => {
    setCity("");
    setType("any");
    setVerifiedOnly(false);
  }} className="rounded-xl">
              Clear all filters
            </Button>
          </div>}
      </main>

      <Footer />
    </div>;
}
export {
  ListingsPage as default
};
