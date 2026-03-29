import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetMyProperties, useGetReceivedEnquiries, useDeleteProperty, getGetMyPropertiesQueryKey } from "@workspace/api-client-react";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Edit, Trash2, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function LandlordDashboard() {
  const { profile } = useAppAuth();
  const { data: propertiesData, isLoading: isLoadingProps } = useGetMyProperties();
  const { data: enquiriesData, isLoading: isLoadingEnq } = useGetReceivedEnquiries();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: deleteProp } = useDeleteProperty({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyPropertiesQueryKey() });
        toast({ title: "Property deleted" });
      }
    }
  });

  const properties = propertiesData?.properties || [];
  const enquiries = enquiriesData?.enquiries || [];

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Navbar />
      
      <div className="bg-primary text-primary-foreground py-12 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-display font-bold">Landlord Dashboard</h1>
          <p className="mt-2 text-primary-foreground/80 text-lg">Welcome back, {profile?.firstName || profile?.username}</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden">
          <Tabs defaultValue="properties" className="w-full">
            <div className="border-b border-border px-6 pt-6">
              <TabsList className="bg-transparent border-b-2 border-transparent w-full justify-start rounded-none h-auto p-0 space-x-8">
                <TabsTrigger 
                  value="properties" 
                  className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-4 px-0 font-medium text-base"
                >
                  My Properties ({properties.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="enquiries"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none pb-4 px-0 font-medium text-base"
                >
                  Tenant Enquiries ({enquiries.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="p-6 md:p-8 m-0">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-display">Manage Listings</h2>
                <Link href="/dashboard/landlord/properties/new">
                  <Button className="rounded-xl shadow-sm"><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
                </Link>
              </div>

              {isLoadingProps ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl"></div>)}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
                  <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                  <Link href="/dashboard/landlord/properties/new">
                    <Button variant="outline" className="rounded-xl">Create your first listing</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {properties.map(prop => (
                    <div key={prop.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-border hover:shadow-md transition-shadow bg-white">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img src={prop.images?.[0] || 'https://via.placeholder.com/400'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-bold text-lg leading-tight mb-1">{prop.title}</h3>
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wide ${
                              prop.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'
                            }`}>
                              {prop.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" /> {prop.city} • ${prop.price}{prop.type==='rent'?'/mo':''}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <Link href={`/dashboard/landlord/properties/edit/${prop.id}`}>
                            <Button variant="outline" size="sm" className="rounded-lg h-9"><Edit className="w-4 h-4 mr-2"/> Edit</Button>
                          </Link>
                          <Link href={`/listings/${prop.id}`}>
                            <Button variant="outline" size="sm" className="rounded-lg h-9"><ExternalLink className="w-4 h-4 mr-2"/> View</Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 rounded-lg ml-auto"
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this listing?')) deleteProp({id: prop.id});
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="enquiries" className="p-6 md:p-8 m-0 bg-muted/5">
              <h2 className="text-xl font-bold font-display mb-6">Messages from Tenants</h2>
              
              {isLoadingEnq ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl"></div>)}
                </div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No enquiries received yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {enquiries.map(enq => (
                    <div key={enq.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-base flex items-center gap-2">
                            {enq.tenant?.firstName} {enq.tenant?.lastName}
                            <span className="text-xs font-normal text-muted-foreground">@{enq.tenant?.username}</span>
                          </p>
                          <Link href={`/listings/${enq.propertyId}`} className="text-primary text-sm hover:underline font-medium mt-1 inline-block">
                            Regarding: {enq.property?.title || 'Property #' + enq.propertyId}
                          </Link>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(enq.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-xl text-sm text-foreground/80 leading-relaxed mb-4">
                        "{enq.message}"
                      </div>
                      {enq.phone && (
                        <div className="inline-flex items-center text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                          Contact number provided: {enq.phone}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
