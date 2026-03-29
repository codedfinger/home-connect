import { Link } from "wouter";
import { MapPin, Bed, Bath, Heart } from "lucide-react";
import { VerifiedBadge, DocumentBadge } from "./Badges";
import { useAddBookmark, useRemoveBookmark, getGetBookmarksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatNaira } from "@/lib/format-currency";
import { useToast } from "@/hooks/use-toast";
function PropertyCard({ property, index = 0 }) {
  const { isAuthenticated, login } = useAppAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: addBookmark, isPending: isAdding } = useAddBookmark({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetBookmarksQueryKey() });
        toast({ title: "Saved to bookmarks" });
      }
    }
  });
  const { mutate: removeBookmark, isPending: isRemoving } = useRemoveBookmark({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetBookmarksQueryKey() });
        toast({ title: "Removed from bookmarks" });
      }
    }
  });
  const isPending = isAdding || isRemoving;
  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      login();
      return;
    }
    if (property.isBookmarked) {
      removeBookmark({ propertyId: property.id });
    } else {
      addBookmark({ data: { propertyId: property.id } });
    }
  };
  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
  return <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    className="group"
  >
      <Link href={`/listings/${property.id}`} className="block h-full">
        <div className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
          {
    /* Image Container */
  }
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {
    /* landing page standard house exterior */
  }
            <img
    src={property.images?.[0] || defaultImage}
    alt={property.title}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
            
            {
    /* Badges Overlay */
  }
            <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold rounded-full shadow-sm uppercase tracking-wider">
                For {property.type}
              </span>
              {property.status !== "available" && <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-sm uppercase tracking-wider">
                  {property.status}
                </span>}
            </div>

            {
    /* Bookmark Button */
  }
            <Button
    variant="ghost"
    size="icon"
    disabled={isPending}
    onClick={handleBookmark}
    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-foreground hover:scale-110 transition-transform"
  >
              <Heart className={`h-5 w-5 ${property.isBookmarked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
            </Button>

            {
    /* Verification Badges */
  }
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {property.isVerified && <VerifiedBadge />}
              {property.hasLandDocuments && <DocumentBadge />}
            </div>
          </div>

          {
    /* Content */
  }
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
            </div>
            
            <p className="text-primary font-bold text-xl mb-4">
              {formatNaira(property.price, property.type, "mo")}
            </p>

            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{property.city} • {property.address}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                  <Bed className="h-4 w-4 text-foreground/70" />
                  {property.bedrooms} Beds
                </span>
                <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                  <Bath className="h-4 w-4 text-foreground/70" />
                  {property.bathrooms} Baths
                </span>
              </div>
              {property.area && <span>{property.area} sqft</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>;
}
export {
  PropertyCard
};
