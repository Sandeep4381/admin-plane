"use client";

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Calendar, User, Store, Car, MapPin, BadgeIndianRupee, CreditCard, MessageSquare, Shield, Check, Ban } from "lucide-react";
import type { Rental } from './rentals-table';
import { cva } from 'class-variance-authority';

type RentalDetailsDrawerProps = {
  rental: Rental | null;
  onOpenChange: (open: boolean) => void;
  onUpdateRental: (rental: Rental) => void;
};

const statusVariants = cva(
    "capitalize",
    {
        variants: {
            status: {
                upcoming: "border-blue-600 text-blue-600",
                active: "border-green-600 text-green-600",
                completed: "border-gray-600 text-gray-600",
                cancelled: "border-red-600 text-red-600",
                disputed: "border-yellow-600 text-yellow-600"
            }
        }
    }
);

function InfoLine({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-muted-foreground mt-1" />
            <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    )
}

function FareLine({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
}


export function RentalDetailsDrawer({ rental, onOpenChange, onUpdateRental }: RentalDetailsDrawerProps) {
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState(rental?.adminNotes || "");

  useEffect(() => {
    if (rental) {
      setAdminNotes(rental.adminNotes);
    }
  }, [rental]);

  if (!rental) return null;

  const handleSaveNotes = () => {
    onUpdateRental({ ...rental, adminNotes });
    toast({
        title: "Notes Saved",
        description: "Admin notes have been updated for this rental."
    })
  };
  
  const handleResolveDispute = (responsibility: 'user' | 'shop' | 'platform') => {
      if(rental.disputeLog) {
        const updatedRental: Rental = {
            ...rental,
            status: 'completed', // Or another appropriate status
            disputeLog: {
                ...rental.disputeLog,
                status: 'resolved',
                resolvedBy: responsibility
            }
        };
        onUpdateRental(updatedRental);
        toast({
            title: "Dispute Resolved",
            description: `Responsibility assigned to ${responsibility}.`,
        });
      }
  }

  return (
    <Sheet open={!!rental} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-none p-0 flex flex-col">
          <SheetHeader className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <SheetTitle className="text-2xl">Rental Details</SheetTitle>
                    <SheetDescription>Booking ID: {rental.id}</SheetDescription>
                </div>
                <Badge variant="outline" className={statusVariants({ status: rental.status })}>{rental.status}</Badge>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <InfoLine icon={Calendar} label="Booking Date" value={new Date(rental.bookingDate).toLocaleString()} />
                <InfoLine icon={MapPin} label="Pickup / Drop Location" value={`${rental.pickupLocation} / ${rental.dropLocation}`} />
            </div>
            
            <Separator />

            <div className="space-y-4">
                 <h4 className="font-semibold text-base">User & Shop</h4>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <InfoLine icon={User} label="User" value={<>{rental.userName} {rental.userVerified ? <Check className="inline h-4 w-4 text-green-500" /> : <Ban className="inline h-4 w-4 text-red-500" />}</>} />
                    <InfoLine icon={Store} label="Shop" value={rental.shopName} />
                    <InfoLine icon={Car} label="Vehicle" value={`${rental.vehicleModel} (${rental.vehicleNumber})`} />
                 </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h4 className="font-semibold text-base">Financials</h4>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <FareLine label="Base Fare" value={`₹${rental.fareDetails.baseFare.toFixed(2)}`} />
                    <FareLine label="Taxes & Surcharges" value={`₹${rental.fareDetails.taxes.toFixed(2)}`} />
                    <FareLine label="Discount" value={`- ₹${rental.fareDetails.discount.toFixed(2)}`} />
                    {rental.fareDetails.penalty > 0 && <FareLine label="Penalty" value={`₹${rental.fareDetails.penalty.toFixed(2)}`} />}
                    <Separator />
                    <div className="flex justify-between items-center text-base">
                        <p className="font-semibold">Total</p>
                        <p className="font-bold text-lg">₹{rental.fareDetails.total.toFixed(2)}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <InfoLine icon={BadgeIndianRupee} label="Commission Earned" value={`₹${rental.commission.toFixed(2)}`} />
                    <InfoLine icon={CreditCard} label="Payment" value={`${rental.paymentMethod} (${rental.paymentStatus})`} />
                </div>
            </div>

            {rental.cancellationLog && (
                <>
                <Separator />
                <div className="space-y-2">
                    <h4 className="font-semibold text-base flex items-center gap-2"><XCircle className="h-5 w-5 text-red-500"/>Cancellation Log</h4>
                    <p className="text-sm"><span className="text-muted-foreground">Reason:</span> {rental.cancellationLog.reason}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Cancelled By:</span> {rental.cancellationLog.by}</p>
                    <p className="text-sm"><span className="text-muted-foreground">Date:</span> {new Date(rental.cancellationLog.date).toLocaleString()}</p>
                </div>
                </>
            )}

            {rental.disputeLog && (
                <>
                <Separator />
                <div className="space-y-3">
                    <h4 className="font-semibold text-base flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-500"/>Dispute Log</h4>
                    <p className="text-sm"><span className="text-muted-foreground">Reason:</span> {rental.disputeLog.reason}</p>
                    <Badge variant={rental.disputeLog.status === 'open' ? 'destructive' : 'default'}>{rental.disputeLog.status}</Badge>
                    {rental.disputeLog.status === 'open' && (
                        <div className="pt-2">
                            <p className="text-sm font-medium mb-2">Resolve Dispute</p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleResolveDispute('user')}>Blame User</Button>
                                <Button size="sm" variant="outline" onClick={() => handleResolveDispute('shop')}>Blame Shop</Button>
                                <Button size="sm" variant="outline" onClick={() => handleResolveDispute('platform')}>Platform Error</Button>
                            </div>
                        </div>
                    )}
                </div>
                </>
            )}


            <Separator />
            
            <div className="space-y-2">
                <Label htmlFor="admin-notes" className="font-semibold text-base flex items-center gap-2"><MessageSquare />Admin Notes</Label>
                <Textarea 
                    id="admin-notes" 
                    placeholder="Add internal notes for this rental..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="min-h-[100px]"
                />
            </div>
          </div>
          <SheetFooter className="p-6 bg-background border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
