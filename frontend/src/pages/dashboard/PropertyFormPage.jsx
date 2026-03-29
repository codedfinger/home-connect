import { useParams, useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateProperty, useUpdateProperty, useGetProperty, getGetMyPropertiesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["rent", "sale"]),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Full address is required"),
  bedrooms: z.coerce.number().min(0, "Cannot be negative"),
  bathrooms: z.coerce.number().min(0, "Cannot be negative"),
  area: z.coerce.number().optional().nullable(),
  images: z.string().transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean)),
  hasLandDocuments: z.boolean().default(false),
  status: z.enum(["available", "rented", "sold"]).optional()
});
function PropertyFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const propertyId = id ? parseInt(id, 10) : 0;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: property, isLoading: isLoadingProp } = useGetProperty(propertyId, {
    query: { enabled: isEditing }
  });
  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "rent",
      price: 0,
      city: "",
      address: "",
      bedrooms: 1,
      bathrooms: 1,
      area: null,
      images: [],
      // handled by transform
      hasLandDocuments: false,
      status: "available"
    }
  });
  useEffect(() => {
    if (property && isEditing) {
      form.reset({
        ...property,
        images: property.images?.join(", ")
        // string for text input
      });
    }
  }, [property, isEditing, form]);
  const { mutate: createProp, isPending: isCreating } = useCreateProperty({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyPropertiesQueryKey() });
        toast({ title: "Property listed successfully!" });
        setLocation("/dashboard/landlord");
      }
    }
  });
  const { mutate: updateProp, isPending: isUpdating } = useUpdateProperty({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyPropertiesQueryKey() });
        toast({ title: "Property updated successfully!" });
        setLocation("/dashboard/landlord");
      }
    }
  });
  const onSubmit = (values) => {
    if (isEditing) {
      updateProp({ id: propertyId, data: values });
    } else {
      createProp({ data: values });
    }
  };
  const isPending = isCreating || isUpdating;
  if (isEditing && isLoadingProp) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  return <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => setLocation("/dashboard/landlord")} className="mb-6 -ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display">{isEditing ? "Edit Property" : "List New Property"}</h1>
            <p className="text-muted-foreground mt-2">Provide detailed information to attract the best tenants or buyers.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="title" render={({ field }) => <FormItem className="md:col-span-2">
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl><Input placeholder="Beautiful 2BHK in Downtown" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>} />

                <FormField control={form.control} name="type" render={({ field }) => <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

                <FormField control={form.control} name="price" render={({ field }) => <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>} />

                {isEditing && <FormField control={form.control} name="status" render={({ field }) => <FormItem className="md:col-span-2">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />}

                <FormField control={form.control} name="city" render={({ field }) => <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl><Input placeholder="e.g. New York" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>} />

                <FormField control={form.control} name="address" render={({ field }) => <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St, Apt 4B" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>} />

                <div className="md:col-span-2 grid grid-cols-3 gap-6">
                  <FormField control={form.control} name="bedrooms" render={({ field }) => <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={form.control} name="bathrooms" render={({ field }) => <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl><Input type="number" className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>} />
                  <FormField control={form.control} name="area" render={({ field }) => <FormItem>
                      <FormLabel>Area (sqft) - Optional</FormLabel>
                      <FormControl><Input type="number" className="h-12 rounded-xl" {...field} value={field.value || ""} /></FormControl>
                      <FormMessage />
                    </FormItem>} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the property's best features..." className="min-h-[150px] rounded-xl resize-y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

                <FormField control={form.control} name="images" render={({ field }) => <FormItem className="md:col-span-2">
                    <FormLabel>Image URLs (Comma separated)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="https://image1.jpg, https://image2.jpg" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormDescription>For MVP, paste direct image URLs separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>} />

                <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                  <FormField control={form.control} name="hasLandDocuments" render={({ field }) => <FormItem className="flex flex-row items-center justify-between rounded-lg">
                      <div className="space-y-1.5">
                        <FormLabel className="text-emerald-900 font-bold text-lg">I have valid land/title documents</FormLabel>
                        <FormDescription className="text-emerald-700">
                          Properties with verified documents get 3x more views and enquiries. 
                          By checking this, you agree to provide documents upon request.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-600" />
                      </FormControl>
                    </FormItem>} />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setLocation("/dashboard/landlord")} className="rounded-xl px-6">
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="rounded-xl px-10 h-12 text-base shadow-lg">
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isEditing ? "Save Changes" : "Publish Listing"}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>;
}
export {
  PropertyFormPage as default
};
