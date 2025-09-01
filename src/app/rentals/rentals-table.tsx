"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, X, Undo, Car } from "lucide-react";
import { cva } from 'class-variance-authority';
import { ActionDialog } from './page';

export type RentalStatus = 'upcoming' | 'active' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export type Rental = {
  id: string;
  userName: string;
  userContact: string;
  userVerified: boolean;
  shopName: string;
  vehicleModel: string;
  vehicleNumber: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  commission: number;
  fareDetails: {
    baseFare: number;
    taxes: number;
    discount: number;
    penalty: number;
    total: number;
  };
  cancellationLog?: {
    reason: string;
    by: 'user' | 'shop' | 'admin';
    date: string;
  };
  disputeLog?: {
    reason: string;
    status: 'open' | 'resolved';
    resolvedBy?: 'user' | 'shop' | 'platform';
  };
  adminNotes: string;
};

export const initialRentalsData: Rental[] = [
  { id: 'BK001', userName: 'Alice Johnson', userContact: '123-456-7890', userVerified: true, shopName: 'Deluxe Car Rentals', vehicleModel: 'Toyota Camry', vehicleNumber: 'NYC-1234', pickupLocation: 'JFK Airport', dropLocation: 'Downtown Manhattan', bookingDate: '2024-07-25T10:00:00Z', status: 'active', paymentStatus: 'paid', paymentMethod: 'Credit Card', commission: 25.00, fareDetails: { baseFare: 200, taxes: 20, discount: 0, penalty: 0, total: 220 }, adminNotes: '' },
  { id: 'BK002', userName: 'Bob Williams', userContact: '234-567-8901', userVerified: false, shopName: 'Speedy Bikes', vehicleModel: 'Honda Activa', vehicleNumber: 'LA-5678', pickupLocation: 'Santa Monica Pier', dropLocation: 'Venice Beach', bookingDate: '2024-07-26T14:00:00Z', status: 'upcoming', paymentStatus: 'pending', paymentMethod: 'UPI', commission: 5.00, fareDetails: { baseFare: 45, taxes: 5, discount: 0, penalty: 0, total: 50 }, adminNotes: 'User needs to complete verification.' },
  { id: 'BK003', userName: 'Charlie Brown', userContact: '345-678-9012', userVerified: true, shopName: 'Metro Auto', vehicleModel: 'Ford Mustang', vehicleNumber: 'CHI-9012', pickupLocation: 'O\'Hare Airport', dropLocation: 'The Loop', bookingDate: '2024-07-20T12:00:00Z', status: 'completed', paymentStatus: 'paid', paymentMethod: 'Credit Card', commission: 40.00, fareDetails: { baseFare: 350, taxes: 35, discount: 15, penalty: 0, total: 370 }, adminNotes: '' },
  { id: 'BK004', userName: 'Diana Miller', userContact: '456-789-0123', userVerified: true, shopName: 'City Scooters', vehicleModel: 'Vespa', vehicleNumber: 'HOU-3456', pickupLocation: 'Galleria Mall', dropLocation: 'Museum District', bookingDate: '2024-07-22T09:00:00Z', status: 'cancelled', paymentStatus: 'refunded', paymentMethod: 'Debit Card', commission: 0, fareDetails: { baseFare: 30, taxes: 3, discount: 0, penalty: 0, total: 33 }, cancellationLog: { reason: 'Changed my mind', by: 'user', date: '2024-07-21T18:00:00Z' }, adminNotes: '' },
  { id: 'BK005', userName: 'Ethan Davis', userContact: '567-890-1234', userVerified: true, shopName: 'Deluxe Car Rentals', vehicleModel: 'Tesla Model 3', vehicleNumber: 'MIA-7890', pickupLocation: 'South Beach', dropLocation: 'Miami Airport', bookingDate: '2024-07-24T18:00:00Z', status: 'disputed', paymentStatus: 'paid', paymentMethod: 'Credit Card', commission: 35.00, fareDetails: { baseFare: 300, taxes: 30, discount: 0, penalty: 0, total: 330 }, disputeLog: { reason: 'Vehicle was not clean', status: 'open' }, adminNotes: '' },
];


const statusVariants = cva(
    "capitalize",
    {
        variants: {
            status: {
                upcoming: "text-blue-600 bg-blue-100",
                active: "text-green-600 bg-green-100",
                completed: "text-gray-600 bg-gray-100",
                cancelled: "text-red-600 bg-red-100",
                disputed: "text-yellow-600 bg-yellow-100"
            }
        }
    }
);

const paymentStatusVariants = cva(
    "capitalize",
    {
        variants: {
            status: {
                paid: "text-green-600",
                pending: "text-orange-600",
                refunded: "text-blue-600"
            }
        }
    }
)

type RentalsTableProps = {
    rentals: Rental[],
    onViewDetails: (rental: Rental) => void,
    onCancel: (rentalId: string, reason: string) => void,
    onRefund: (rentalId: string, reason: string) => void,
    onReassign: (rentalId: string, reason: string) => void,
}

export function RentalsTable({ rentals, onViewDetails, onCancel, onRefund, onReassign }: RentalsTableProps) {
    if (rentals.length === 0) {
        return <div className="p-6 text-center text-muted-foreground">No rentals found.</div>
    }

    const isActionable = (rental: Rental) => !['completed', 'cancelled'].includes(rental.status);


    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User / Shop</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
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
                         <TableCell>{new Date(rental.bookingDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                           <Badge variant="outline" className={statusVariants({ status: rental.status })}>{rental.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <span className={paymentStatusVariants({ status: rental.paymentStatus })}>{rental.paymentStatus}</span>
                        </TableCell>
                        <TableCell>₹{rental.commission.toFixed(2)}</TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => onViewDetails(rental)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    {isActionable(rental) && (
                                        <>
                                            <ActionDialog 
                                                title="Cancel Rental"
                                                description="Are you sure you want to cancel this rental? This action cannot be undone."
                                                onAction={(reason) => onCancel(rental.id, reason)}
                                                destructive
                                                trigger={
                                                    <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full">
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancel
                                                    </div>
                                                }
                                            />
                                            <ActionDialog 
                                                title="Process Refund"
                                                description="Please confirm you want to refund this payment. Specify a reason for the log."
                                                onAction={(reason) => onRefund(rental.id, reason)}
                                                trigger={
                                                     <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                                        <Undo className="mr-2 h-4 w-4" />
                                                        Refund
                                                    </div>
                                                }
                                            />
                                            <ActionDialog 
                                                title="Reassign Vehicle"
                                                description="Are you sure you want to reassign the vehicle for this rental? Provide a reason for this change."
                                                onAction={(reason) => onReassign(rental.id, reason)}
                                                trigger={
                                                     <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                                        <Car className="mr-2 h-4 w-4" />
                                                        Reassign
                                                    </div>
                                                }
                                            />
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
