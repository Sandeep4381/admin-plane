
"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "./page";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, History, Mail, Send, Wallet, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type UserProfileDialogProps = {
  user: User | null;
  onOpenChange: (open: boolean) => void;
};

const topRides = [
    { id: 'R234', vehicle: 'Toyota Camry', shop: 'Deluxe Rentals', date: '2024-07-15' },
    { id: 'R211', vehicle: 'Honda Activa', shop: 'Speedy Bikes', date: '2024-07-10' },
    { id: 'R198', vehicle: 'Toyota Camry', shop: 'Deluxe Rentals', date: '2024-06-28' },
    { id: 'R180', vehicle: 'Ford Mustang', shop: 'Metro Auto', date: '2024-06-20' },
    { id: 'R175', vehicle: 'Vespa SXL 150', shop: 'City Scooters', date: '2024-06-12' },
];

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

export function UserProfileDialog({ user, onOpenChange }: UserProfileDialogProps) {
  if (!user) return null;
  
  const lastLoginDate = new Date(user.lastLogin).toLocaleString();

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
            <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="person face" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <DialogTitle className="text-2xl">{user.name}</DialogTitle>
                    <DialogDescription>{user.email}</DialogDescription>
                    <DialogDescription>{user.phone}</DialogDescription>
                     <div className="flex items-center gap-2 pt-1">
                        {user.isVerified && <Badge variant="default">Verified</Badge>}
                        {user.loyalty && <Badge variant="secondary">{user.loyalty} Tier</Badge>}
                     </div>
                </div>
            </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Rentals" value={user.totalRentals} icon={History} />
                    <StatCard label="Cancellations" value={user.cancellations} icon={XCircle} />
                    <StatCard label="Lifetime Spend" value={`₹${user.lifetimeSpend.toLocaleString()}`} icon={Wallet} />
                    <StatCard label="Wallet Balance" value={`₹${user.walletBalance.toLocaleString()}`} icon={Wallet} />
                </div>
                
                <Separator />

                <div>
                    <h4 className="font-semibold text-lg mb-2">Top 5 Rides</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ride ID</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Shop</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topRides.map((ride) => (
                                <TableRow key={ride.id}>
                                    <TableCell>{ride.id}</TableCell>
                                    <TableCell>{ride.vehicle}</TableCell>
                                    <TableCell>{ride.shop}</TableCell>
                                    <TableCell>{ride.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-2">User Details</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Login:</span>
                                <span>{lastLoginDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Most Rented City:</span>
                                <span>New York</span>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-lg mb-2">Fraud Alerts</h4>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <p>No fraud alerts detected for this user.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2">
                <Button size="sm"><Send className="mr-2 h-4 w-4"/>Send Push</Button>
                <Button size="sm" variant="outline"><Mail className="mr-2 h-4 w-4"/>Send Email</Button>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
