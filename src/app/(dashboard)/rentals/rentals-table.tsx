
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, XCircle, RefreshCw, Send } from "lucide-react";
import { ActionDialog } from './page';


export type Rental = {
  id: string;
  userName: string;
  shopName: string;
  vehicleModel: string;
  vehicleNumber: string;
  startDate: string;
  endDate: string;
  totalFare: number;
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'pending';
  status: 'active' | 'upcoming' | 'completed' | 'cancelled' | 'disputed';
  cancellationLog?: {
    reason: string;
    by: 'user' | 'shop' | 'admin';
    date: string;
  };
};

export const initialRentalsData: Rental[] = [
  { id: 'R001', userName: 'Alice Johnson', shopName: 'Deluxe Car Rentals', vehicleModel: 'Toyota Camry', vehicleNumber: 'NYC-1234', startDate: '2024-07-22', endDate: '2024-07-24', totalFare: 150, paymentStatus: 'paid', status: 'active' },
  { id: 'R002', userName: 'Bob Williams', shopName: 'Speedy Bikes', vehicleModel: 'Honda Activa', vehicleNumber: 'LA-5678', startDate: '2024-07-23', endDate: '2024-07-23', totalFare: 25, paymentStatus: 'unpaid', status: 'upcoming' },
  { id: 'R003', userName: 'Charlie Brown', shopName: 'Metro Auto', vehicleModel: 'Ford Mustang', vehicleNumber: 'CHI-9012', startDate: '2024-07-18', endDate: '2024-07-20', totalFare: 350, paymentStatus: 'paid', status: 'completed' },
  { id: 'R004', userName: 'Diana Miller', shopName: 'City Scooters', vehicleModel: 'Vespa SXL 150', vehicleNumber: 'MIA-3456', startDate: '2024-07-20', endDate: '2024-07-21', totalFare: 45, paymentStatus: 'refunded', status: 'cancelled' },
  { id: 'R005', userName: 'Ethan Davis', shopName: 'Suburban Rides', vehicleModel: 'Chevrolet Tahoe', vehicleNumber: 'HOU-7890', startDate: '2024-07-25', endDate: '2024-07-28', totalFare: 450, paymentStatus: 'pending', status: 'upcoming' },
  { id: 'R006', userName: 'Alice Johnson', shopName: 'Deluxe Car Rentals', vehicleModel: 'Nissan Rogue', vehicleNumber: 'NYC-4321', startDate: '2024-06-10', endDate: '2024-06-12', totalFare: 180, paymentStatus: 'paid', status: 'completed' },
  { id: 'R007', userName: 'Frank White', shopName: 'Blocked Wheels', vehicleModel: 'Ford Focus', vehicleNumber: 'SEA-1122', startDate: '2024-07-21', endDate: '2024-07-22', totalFare: 90, paymentStatus: 'paid', status: 'disputed' },
];

const statusVariant: { [key in Rental['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  active: 'default',
  upcoming: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
  disputed: 'destructive'
};

const paymentStatusVariant: { [key in Rental['paymentStatus']]: "default" | "secondary" | "destructive" | "outline" } = {
    paid: 'default',
    unpaid: 'secondary',
    refunded: 'outline',
    pending: 'secondary'
}

type RentalsTableProps = {
    rentals: Rental[];
    onViewDetails: (rental: Rental) => void;
    onCancel: (rentalId: string, reason: string) => void;
    onRefund: (rentalId: string, reason: string) => void;
    onReassign: (rentalId: string, reason: string) => void;
};


export function RentalsTable({ rentals, onViewDetails, onCancel, onRefund, onReassign }: RentalsTableProps) {
  return (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Rental ID</TableHead>
                <TableHead>User / Shop</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rentals.map((rental) => (
                <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.id}</TableCell>
                    <TableCell>
                        <div className="font-medium">{rental.userName}</div>
                        <div className="text-sm text-muted-foreground">{rental.shopName}</div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{rental.vehicleModel}</div>
                        <div className="text-sm text-muted-foreground">{rental.vehicleNumber}</div>
                    </TableCell>
                    <TableCell>
                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">₹{rental.totalFare.toLocaleString()}</div>
                        <Badge variant={paymentStatusVariant[rental.paymentStatus]} className="capitalize">{rental.paymentStatus}</Badge>
                    </TableCell>
                     <TableCell>
                        <Badge variant={statusVariant[rental.status]} className="capitalize">{rental.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onViewDetails(rental)}>
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                
                                {rental.status === 'active' || rental.status === 'upcoming' ? (
                                    <ActionDialog
                                        trigger={<><XCircle className="mr-2 h-4 w-4"/> Cancel Booking</>}
                                        title="Cancel Rental Booking"
                                        description="Are you sure you want to cancel this booking? This action may trigger a refund if already paid."
                                        onAction={(reason) => onCancel(rental.id, reason)}
                                        destructive
                                    />
                                ) : null}

                                {rental.paymentStatus === 'paid' && rental.status !== 'refunded' && (
                                     <ActionDialog
                                        trigger={<><RefreshCw className="mr-2 h-4 w-4"/> Process Refund</>}
                                        title="Process Refund"
                                        description="Are you sure you want to process a refund for this rental?"
                                        onAction={(reason) => onRefund(rental.id, reason)}
                                    />
                                )}
                                
                                {rental.status === 'active' && (
                                     <ActionDialog
                                        trigger={<><Send className="mr-2 h-4 w-4"/> Reassign Vehicle</>}
                                        title="Reassign Vehicle"
                                        description="Are you sure you want to reassign the vehicle for this rental?"
                                        onAction={(reason) => onReassign(rental.id, reason)}
                                    />
                                )}

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  );
}
