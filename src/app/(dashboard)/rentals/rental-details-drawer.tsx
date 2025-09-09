
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import type { Rental } from './rentals-table';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type RentalDetailsDrawerProps = {
  rental: Rental | null;
  onOpenChange: (open: boolean) => void;
  onUpdateRental: (rental: Rental) => void;
};

export function RentalDetailsDrawer({ rental, onOpenChange, onUpdateRental }: RentalDetailsDrawerProps) {
  if (!rental) return null;
  
  const [adminNotes, setAdminNotes] = useState("");

  const handleDisputeResolution = (responsibleParty: 'user' | 'shop' | 'platform') => {
    // In a real app, this would update the backend.
    const updatedRental: Rental = {
        ...rental,
        status: 'completed',
        cancellationLog: {
            by: 'admin',
            date: new Date().toISOString(),
            reason: `Dispute resolved. Responsibility assigned to: ${responsibleParty}`
        }
    };
    onUpdateRental(updatedRental);
  };

  return (
    <Sheet open={!!rental} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:w-[640px] p-0 flex flex-col">
        <SheetHeader className="p-6">
          <SheetTitle className="text-2xl">Rental Details: {rental.id}</SheetTitle>
          <SheetDescription>
            {rental.userName} renting {rental.vehicleModel} from {rental.shopName}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div><span className="font-semibold">User:</span> {rental.userName}</div>
                <div><span className="font-semibold">Shop:</span> {rental.shopName}</div>
                <div><span className="font-semibold">Vehicle:</span> {rental.vehicleModel} ({rental.vehicleNumber})</div>
                <div><span className="font-semibold">Duration:</span> {new Date(rental.startDate).toLocaleDateString()} to {new Date(rental.endDate).toLocaleDateString()}</div>
            </div>

            <Separator />
            
            <div>
                <h4 className="font-semibold mb-2">Fare Breakdown</h4>
                <div className="flex justify-between"><span>Base Fare:</span> <span>₹{rental.totalFare - 20}</span></div>
                <div className="flex justify-between"><span>Taxes & Fees:</span> <span>₹20</span></div>
                <div className="flex justify-between font-bold mt-1"><span>Total:</span> <span>₹{rental.totalFare}</span></div>
            </div>

            <Separator />

             <div>
                <h4 className="font-semibold mb-2">Status & Payment</h4>
                <div className="flex justify-between">
                    <span>Booking Status:</span>
                    <Badge variant={rental.status === 'cancelled' || rental.status === 'disputed' ? 'destructive' : 'default'} className="capitalize">{rental.status}</Badge>
                </div>
                 <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge variant={rental.paymentStatus === 'paid' ? 'default' : 'secondary'} className="capitalize">{rental.paymentStatus}</Badge>
                </div>
            </div>

            {rental.cancellationLog && (
              <>
                <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Cancellation Log</h4>
                    <p className="text-sm">Reason: {rental.cancellationLog.reason}</p>
                    <p className="text-sm text-muted-foreground">Cancelled by: {rental.cancellationLog.by} on {new Date(rental.cancellationLog.date).toLocaleString()}</p>
                </div>
              </>
            )}

            <Separator />

            {rental.status === 'disputed' && (
                <div>
                    <h4 className="font-semibold mb-2 text-destructive">Dispute Resolution</h4>
                    <p className="text-sm mb-4 text-muted-foreground">This rental is marked as disputed. Please review the case and assign responsibility.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleDisputeResolution('user')}>User Fault</Button>
                        <Button variant="outline" onClick={() => handleDisputeResolution('shop')}>Shop Fault</Button>
                        <Button variant="outline" onClick={() => handleDisputeResolution('platform')}>Platform Issue</Button>
                    </div>
                </div>
            )}
            
            <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <Textarea placeholder="Add internal notes about this rental..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
            </div>

        </div>
        <SheetFooter className="p-6 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Save Notes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    