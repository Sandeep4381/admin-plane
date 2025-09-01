import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/app/users/page";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, History, MessageSquare, Send, Mail, Smartphone } from "lucide-react";

type UserProfileDrawerProps = {
  user: User | null;
  onOpenChange: (open: boolean) => void;
};

function StatCard({ label, value, icon: Icon }: { label: string, value: string | number, icon: React.ElementType }) {
    return (
        <div className="flex items-center gap-4 rounded-lg border p-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        </div>
    )
}

export function UserProfileDrawer({ user, onOpenChange }: UserProfileDrawerProps) {
  if (!user) return null;
  
  const lastLoginDate = new Date(user.lastLogin).toLocaleString();

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full overflow-y-auto">
            <SheetHeader className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="person face" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <SheetTitle className="text-2xl">{user.name}</SheetTitle>
                        <SheetDescription>{user.email}</SheetDescription>
                        <SheetDescription>{user.phone}</SheetDescription>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button size="sm"><Send className="mr-2"/>Send Push</Button>
                    <Button size="sm" variant="outline"><Mail className="mr-2"/>Send Email</Button>
                    <Button size="sm" variant="outline"><Smartphone className="mr-2"/>Send SMS</Button>
                </div>
            </SheetHeader>
            <Separator />
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Total Rentals" value={user.totalRentals} icon={History} />
                    <StatCard label="Cancellations" value={user.cancellations} icon={XCircle} />
                    <StatCard label="Lifetime Spend" value={`₹${user.lifetimeSpend.toLocaleString()}`} icon={Wallet} />
                    <StatCard label="Wallet Balance" value={`₹${user.walletBalance.toLocaleString()}`} icon={Wallet} />
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2">User Details</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Login:</span>
                            <span>{lastLoginDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Loyalty Tier:</span>
                            <span>{user.loyalty ? <Badge>{user.loyalty}</Badge> : "N/A"}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Most Rented City:</span>
                            <span>New York</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold text-lg mb-2">Offer Usage History</h4>
                    <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">No offers used yet.</p>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold text-lg mb-2">Complaint/Support Logs</h4>
                     <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">No support tickets found.</p>
                    </div>
                </div>

                 <Separator />

                <div>
                    <h4 className="font-semibold text-lg mb-2">Fraud Alerts</h4>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <p>No fraud alerts detected for this user.</p>
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
