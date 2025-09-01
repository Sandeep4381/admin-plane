"use client";

import React, { useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search, Car, TrendingUp, XCircle, Clock } from 'lucide-react';
import { RentalsTable, initialRentalsData, Rental } from './rentals-table';
import { RentalDetailsDrawer } from './rental-details-drawer';

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


function RentalsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const [currentSearch, setCurrentSearch] = useState(searchParams.get('search') || "");
  const [rentals, setRentals] = useState<Rental[]>(initialRentalsData);
  const [viewingRental, setViewingRental] = useState<Rental | null>(null);

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
    setViewingRental(updatedRental); // Keep drawer open with updated data
  }


  return (
    <DashboardLayout>
      <PageHeader title="Rental Management" />
      
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Rentals (Month)" value="1,284" icon={Car} />
          <StatCard title="Total Revenue" value="₹2,54,800" icon={TrendingUp} />
          <StatCard title="Cancellation Rate" value="5.8%" icon={XCircle} />
          <StatCard title="Active Rentals" value="42" icon={Clock} />
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
               <RentalsTable rentals={filteredRentals} onViewDetails={handleViewDetails} />
            </CardContent>
          </Card>
        </Tabs>
      </div>
      <RentalDetailsDrawer 
        rental={viewingRental}
        onOpenChange={(open) => !open && setViewingRental(null)}
        onUpdateRental={handleUpdateRental}
      />
    </DashboardLayout>
  );
}


export default function RentalsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <RentalsPageContent />
    </React.Suspense>
  );
}
