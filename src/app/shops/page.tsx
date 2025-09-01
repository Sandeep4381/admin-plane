"use client";

import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const initialShopsData = [
  { id: 'S001', name: 'Deluxe Car Rentals', city: 'New York', owner: 'John Doe', verified: true, status: 'verified' },
  { id: 'S002', name: 'Speedy Bikes', city: 'Los Angeles', owner: 'Jane Smith', verified: true, status: 'verified' },
  { id: 'S003', name: 'City Scooters', city: 'Chicago', owner: 'Peter Jones', verified: false, status: 'pending' },
  { id: 'S004', name: 'Metro Auto', city: 'Houston', owner: 'Mary Johnson', verified: true, status: 'verified' },
  { id: 'S005', name: 'Suburban Rides', city: 'Phoenix', owner: 'David Williams', verified: false, status: 'pending' },
];

function ShopsPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';

  const [shops, setShops] = useState(initialShopsData);

  const handleDelete = (shopId: string) => {
    setShops(shops.filter(shop => shop.id !== shopId));
  };

  const handleBlock = (shopId: string) => {
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, status: 'blocked' } : shop
    ));
  };

  const filteredShops = (status: string) => {
    if (status === 'all') return shops.filter(s => s.status !== 'blocked');
    if (status === 'blocked') return shops.filter(s => s.status === 'blocked');
    return shops.filter(shop => shop.status === status);
  }

  const ShopsTable = ({ shops, tab }: { shops: typeof initialShopsData, tab: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredShops(tab).map((shop) => (
          <TableRow key={shop.id}>
            <TableCell className="font-medium">{shop.name}</TableCell>
            <TableCell>{shop.city}</TableCell>
            <TableCell>{shop.owner}</TableCell>
            <TableCell>
              <Checkbox checked={shop.verified} aria-label="Verified" disabled />
            </TableCell>
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Restrict</DropdownMenuItem>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Block</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to block this shop?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will prevent the shop from appearing in the app.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleBlock(shop.id)}>Block</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <DropdownMenuSeparator />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the shop.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(shop.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <PageHeader title="Shops" >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </PageHeader>
      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={shops} tab="all" />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={shops} tab="verified" />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={shops} tab="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Shops</CardTitle>
            </CardHeader>
            <CardContent>
               {filteredShops('blocked').length > 0 ? (
                <ShopsTable shops={shops} tab="blocked" />
              ) : (
                <p>No blocked shops.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default function ShopsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ShopsPageContent />
    </React.Suspense>
  );
}
