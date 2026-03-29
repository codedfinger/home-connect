import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileCheck, UserCheck } from "lucide-react";

export function VerifiedBadge() {
  return (
    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/50 shadow-sm gap-1 pl-1.5 py-0.5">
      <ShieldCheck className="h-3.5 w-3.5" />
      Verified Property
    </Badge>
  );
}

export function DocumentBadge() {
  return (
    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200/50 shadow-sm gap-1 pl-1.5 py-0.5">
      <FileCheck className="h-3.5 w-3.5" />
      Docs Verified
    </Badge>
  );
}

export function LandlordBadge() {
  return (
    <Badge variant="outline" className="gap-1 pl-1.5 py-0.5 bg-white shadow-sm border-border/50 text-foreground/80">
      <UserCheck className="h-3.5 w-3.5 text-primary" />
      ID Verified
    </Badge>
  );
}
