import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetBookmarks, useGetSentEnquiries } from "@workspace/api-client-react";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { Heart, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

function TenantDashboard() {
  const [, setLocation] = useLocation();
  const { profile, isFullyLoaded } = useAppAuth();

  useEffect(() => {
    if (!isFullyLoaded || !profile) return;
    if (profile.role === "admin") {
      setLocation("/dashboard/admin");
    }
  }, [isFullyLoaded, profile, setLocation]);
  const { data: bookmarksData, isLoading: isLoadingBookmarks } = useGetBookmarks();
  const { data: enquiriesData, isLoading: isLoadingEnq } = useGetSentEnquiries();
  const bookmarks = bookmarksData?.properties || [];
  const enquiries = enquiriesData?.enquiries || [];

  if (!isFullyLoaded || profile?.role === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      
      <div className="bg-secondary text-secondary-foreground py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-display font-bold">Tenant Dashboard</h1>
          <p className="mt-2 text-secondary-foreground/80 text-lg">Manage your saved homes and communications.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
          <Tabs defaultValue="saved" className="w-full">
            <div className="border-b border-border px-6 pt-6">
              <TabsList className="bg-transparent border-b-2 border-transparent w-full justify-start rounded-none h-auto p-0 space-x-8">
                <TabsTrigger
    value="saved"
    className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-4 px-0 font-medium text-base flex items-center gap-2"
  >
                  <Heart className="w-4 h-4" /> Saved Homes ({bookmarks.length})
                </TabsTrigger>
                <TabsTrigger
    value="enquiries"
    className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-4 px-0 font-medium text-base flex items-center gap-2"
  >
                  <MessageSquare className="w-4 h-4" /> My Enquiries ({enquiries.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="saved" className="p-6 md:p-8 m-0 bg-muted/5">
              {isLoadingBookmarks ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)}
                </div> : bookmarks.length === 0 ? <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border max-w-xl mx-auto">
                  <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-display mb-2">No saved properties</h3>
                  <p className="text-muted-foreground mb-6">Properties you bookmark will appear here so you can easily find them later.</p>
                  <Link href="/listings" className="text-primary font-medium hover:underline">Start browsing</Link>
                </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarks.map((prop) => <PropertyCard key={prop.id} property={prop} />)}
                </div>}
            </TabsContent>

            <TabsContent value="enquiries" className="p-6 md:p-8 m-0">
              {isLoadingEnq ? <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />)}
                </div> : enquiries.length === 0 ? <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground">You haven't contacted any landlords yet.</p>
                </div> : <div className="grid gap-4 max-w-4xl">
                  {enquiries.map((enq) => <div key={enq.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-border hover:shadow-md transition-shadow bg-white items-start">
                      <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        {enq.property?.images?.[0] ? <img src={enq.property.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/10">
                            <Heart className="w-6 h-6 text-primary/40" />
                          </div>}
                      </div>
                      <div className="flex-grow">
                        <Link href={`/listings/${enq.propertyId}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                          {enq.property?.title || "Unknown Property"}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> 
                          Sent {format(new Date(enq.createdAt), "MMM d, yyyy")}
                        </p>
                        <div className="mt-3 p-3 bg-muted/40 rounded-lg text-sm text-foreground/80 italic border-l-2 border-primary/30">
                          "{enq.message}"
                        </div>
                      </div>
                    </div>)}
                </div>}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>;
}
export {
  TenantDashboard as default
};
