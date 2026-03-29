import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ListingsPage from "@/pages/ListingsPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import OnboardingPage from "@/pages/OnboardingPage";
import LandlordDashboard from "@/pages/dashboard/LandlordDashboard";
import TenantDashboard from "@/pages/dashboard/TenantDashboard";
import PropertyFormPage from "@/pages/dashboard/PropertyFormPage";
const queryClient = new QueryClient();
function Router() {
  return <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/listings" component={ListingsPage} />
      <Route path="/listings/:id" component={PropertyDetailPage} />
      
      <Route path="/onboarding" component={OnboardingPage} />
      
      <Route path="/dashboard/landlord" component={LandlordDashboard} />
      <Route path="/dashboard/landlord/properties/new" component={PropertyFormPage} />
      <Route path="/dashboard/landlord/properties/edit/:id" component={PropertyFormPage} />
      
      <Route path="/dashboard/tenant" component={TenantDashboard} />
      
      <Route component={NotFound} />
    </Switch>;
}
function App() {
  return <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>;
}
var stdin_default = App;
export {
  stdin_default as default
};
