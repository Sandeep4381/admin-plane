

"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { RentalsTable, initialRentalsData, Rental } from './rentals-table';
import { RentalDetailsDrawer } from './rental-details-drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';


function StatCard({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function ActionDialog({
  trigger,
  title,
  description,
  onAction,
  destructive = false
}: {
  trigger: React.ReactNode,
  title: string,
  description: string,
  onAction: (reason: string) => void,
  destructive?: boolean
}) {
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    onAction(reason);
    setOpen(false);
    setReason("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea placeholder="Provide a reason for this action..." value={reason} onChange={(e) => setReason(e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleAction} 
            className={destructive ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


function RentalsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const [currentSearch, setCurrentSearch] = useState(searchParams.get('search') || "");
  const [rentals, setRentals] = useState<Rental[]>(initialRentalsData);
  const [viewingRental, setViewingRental] = useState<Rental | null>(null);
  const { toast } = useToast();


  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  );

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('tab', value)}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentSearch(value);
    router.push(`${pathname}?${createQueryString('search', value)}`, { scroll: false });
  };
  
  const filteredRentals = useMemo(() => {
    let results = rentals;
    const searchTerm = searchParams.get('search')?.toLowerCase() || "";

    if (tab !== 'all') {
      results = results.filter(r => r.status.toLowerCase() === tab);
    }
    
    if (searchTerm) {
      results = results.filter(r => 
        r.id.toLowerCase().includes(searchTerm) ||
        r.userName.toLowerCase().includes(searchTerm) ||
        r.shopName.toLowerCase().includes(searchTerm) ||
        r.vehicleModel.toLowerCase().includes(searchTerm) ||
        r.vehicleNumber.toLowerCase().includes(searchTerm)
      );
    }
    
    return results;
  }, [rentals, tab, searchParams]);
  
  const handleViewDetails = (rental: Rental) => {
    setViewingRental(rental);
  }

  const handleUpdateRental = (updatedRental: Rental) => {
    setRentals(currentRentals => currentRentals.map(r => r.id === updatedRental.id ? updatedRental : r));
    setViewingRental(updatedRental);
  }

  const handleCancelRental = (rentalId: string, reason: string) => {
    setRentals(prevRentals => prevRentals.map(r => 
      r.id === rentalId ? { 
        ...r, 
        status: 'cancelled',
        paymentStatus: r.paymentStatus === 'paid' ? 'refunded' : r.paymentStatus, // Refund if already paid
        cancellationLog: {
          reason: reason || 'Cancelled by admin',
          by: 'admin',
          date: new Date().toISOString()
        }
      } : r
    ));
    toast({
      title: "Rental Cancelled",
      description: `Rental ${rentalId} has been cancelled. Reason: ${reason}`
    })
  }

  const handleRefund = (rentalId: string, reason: string) => {
     setRentals(prevRentals => prevRentals.map(r => 
      r.id === rentalId ? { 
        ...r, 
        paymentStatus: 'refunded',
      } : r
    ));
    toast({
      title: "Payment Refunded",
      description: `Refund processed for rental ${rentalId}. Reason: ${reason}`
    })
  }
  
  const handleReassign = (rentalId: string, reason: string) => {
    toast({
        title: "Vehicle Reassigned",
        description: `A new vehicle has been assigned for rental ${rentalId}. Reason: ${reason}`
    })
    // In a real app, this would open a modal to select a new vehicle
    // and update the rental with new vehicle details.
  }

  return (
    <>
      <PageHeader title="Rental Management" />
      
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Rentals" value="42" icon={Clock} />
          <StatCard title="Total Revenue" value="₹2,54,800" icon={TrendingUp} />
          <StatCard title="Disputed Rentals" value="1" icon={AlertTriangle} />
          <StatCard title="Cancellation Rate" value="5.8%" icon={XCircle} />
        </div>
        
        <Tabs value={tab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, User, Shop, Vehicle..."
                className="pl-8 w-64"
                value={currentSearch}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Card className="mt-4">
            <CardContent className="p-0">
               <RentalsTable 
                rentals={filteredRentals} 
                onViewDetails={handleViewDetails}
                onCancel={handleCancelRental}
                onRefund={handleRefund}
                onReassign={handleReassign}
               />
            </CardContent>
          </Card>
        </Tabs>
      </div>
      <RentalDetailsDrawer 
        rental={viewingRental}
        onOpenChange={(open) => !open && setViewingRental(null)}
        onUpdateRental={handleUpdateRental}
      />
    </>
  );
}


export default function RentalsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RentalsPageContent />
    </React.Suspense>
  );
}
