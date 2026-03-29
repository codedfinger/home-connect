import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetProperty, useCreateEnquiry } from "@workspace/api-client-react";
import { VerifiedBadge, DocumentBadge, LandlordBadge } from "@/components/shared/Badges";
import { MapPin, Bed, Bath, Square, ArrowLeft, ShieldCheck, Heart, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatNaira } from "@/lib/format-currency";

function PropertyDetailPage() {
  const { id } = useParams();
  const propertyId = parseInt(id, 10);
  const { data: property, isLoading, error } = useGetProperty(propertyId);
  const { isAuthenticated, login, user } = useAppAuth();
  const { toast } = useToast();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [message, setMessage] = useState("Hi, I'm interested in this property. Is it still available?");
  const [phone, setPhone] = useState("");
  const { mutate: sendEnquiry, isPending: isSending } = useCreateEnquiry({
    mutation: {
      onSuccess: () => {
        setEnquiryOpen(false);
        toast({
          title: "Enquiry Sent!",
          description: "The landlord will contact you soon."
        });
      },
      onError: (err) => {
        toast({
          title: "Failed to send enquiry",
          description: err.message || "Please try again.",
          variant: "destructive"
        });
      }
    }
  });
  const handleContactClick = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    setEnquiryOpen(true);
  };
  const submitEnquiry = () => {
    sendEnquiry({
      data: {
        propertyId,
        message,
        phone: phone || void 0
      }
    });
  };
  if (isLoading) return <div className="min-h-screen bg-muted/10">
      <Navbar />
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-muted rounded-3xl" />
          <div className="h-[400px] bg-muted rounded-3xl" />
        </div>
      </div>
    </div>;
  if (error || !property) return <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Link href="/listings"><Button>Back to Listings</Button></Link>
        </div>
      </div>
    </div>;
  const images = property.images?.length > 0 ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];
  return <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <Link href="/listings" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
        </Link>

        {
    /* Header */
  }
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                For {property.type}
              </span>
              {property.status !== "available" && <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                  {property.status}
                </span>}
              {property.isVerified && <VerifiedBadge />}
              {property.hasLandDocuments && <DocumentBadge />}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-muted-foreground text-lg">
              <MapPin className="h-5 w-5 mr-1" />
              {property.address}, {property.city}
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-3xl md:text-4xl font-bold text-primary font-display">
              {formatNaira(property.price, property.type, "month")}
            </p>
          </div>
        </div>

        {
    /* Gallery */
  }
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[40vh] md:h-[60vh]">
          <div className="md:col-span-3 h-full rounded-3xl overflow-hidden relative group">
            <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {images.slice(1, 3).map((img, i) => <div key={i} className="flex-1 rounded-3xl overflow-hidden relative">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>)}
            {images.length <= 1 && <div className="flex-1 rounded-3xl overflow-hidden bg-muted flex items-center justify-center border border-border">
                <p className="text-muted-foreground text-sm font-medium">No more photos</p>
              </div>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {
    /* Main Details */
  }
          <div className="lg:col-span-2 space-y-10">
            {
    /* Quick Facts */
  }
            <div className="flex flex-wrap gap-6 py-6 border-y border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-2xl"><Bed className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground font-display">{property.bedrooms}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-2xl"><Bath className="h-6 w-6 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground font-display">{property.bathrooms}</p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Bathrooms</p>
                </div>
              </div>
              {property.area && <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-2xl"><Square className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p className="text-2xl font-bold text-foreground font-display">{property.area}</p>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Square Feet</p>
                  </div>
                </div>}
            </div>

            {
    /* Description */
  }
            <div>
              <h3 className="text-2xl font-bold font-display mb-4">About this property</h3>
              <div className="prose max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap leading-relaxed">{property.description}</p>
              </div>
            </div>

            {
    /* Verification Section */
  }
            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="text-xl font-bold font-display text-emerald-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                HomeConnect Verification
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">Landlord Identity</p>
                    <p className="text-sm text-emerald-700 mt-1">Government ID has been securely verified by our team.</p>
                  </div>
                </div>
                {property.hasLandDocuments && <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">Title Deed & Documents</p>
                      <p className="text-sm text-emerald-700 mt-1">Proof of ownership documents have been submitted and verified.</p>
                    </div>
                  </div>}
              </div>
            </div>
          </div>

          {
    /* Sidebar / Contact */
  }
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-border shadow-lg p-6">
              <h3 className="font-bold font-display text-lg mb-4">Listed by</h3>
              
              <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-muted/30">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {property.landlord?.profileImage ? <img src={property.landlord.profileImage} alt="Owner" className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-primary" />}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {property.landlord?.firstName || property.landlord?.lastName
                      ? `${property.landlord?.firstName ?? ""} ${property.landlord?.lastName ?? ""}`.trim()
                      : property.landlord?.username ?? "Property contact"}
                  </p>
                  {property.landlord?.phone && <p className="text-sm text-muted-foreground mt-1">{property.landlord.phone}</p>}
                  {property.landlord?.isVerified && <div className="mt-2"><LandlordBadge /></div>}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
    size="lg"
    className="w-full rounded-xl h-14 text-base shadow-md"
    onClick={handleContactClick}
    disabled={property.status !== "available"}
  >
                  {property.status === "available" ? "Contact Landlord" : `Property is ${property.status}`}
                </Button>
                
                <Button variant="outline" size="lg" className="w-full rounded-xl h-14 text-base">
                  <Heart className="h-5 w-5 mr-2" /> Save Property
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Connect safely without agents.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {
    /* Enquiry Dialog */
  }
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Contact Owner</DialogTitle>
            <DialogDescription>
              Send a direct message to the landlord regarding {property.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Your Message</Label>
              <Textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    className="min-h-[120px] rounded-xl resize-none"
  />
            </div>
            <div className="space-y-2">
              <Label>Your Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
    placeholder="+234 800 000 0000"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="pl-9 rounded-xl"
  />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEnquiryOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={submitEnquiry} disabled={isSending} className="rounded-xl px-8">
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  PropertyDetailPage as default
};
