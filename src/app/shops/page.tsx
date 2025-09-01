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
import React from 'react';

const shopsData = [
  { id: 'S001', name: 'Deluxe Car Rentals', city: 'New York', owner: 'John Doe', verified: true },
  { id: 'S002', name: 'Speedy Bikes', city: 'Los Angeles', owner: 'Jane Smith', verified: true },
  { id: 'S003', name: 'City Scooters', city: 'Chicago', owner: 'Peter Jones', verified: false },
  { id: 'S004', name: 'Metro Auto', city: 'Houston', owner: 'Mary Johnson', verified: true },
  { id: 'S005', name: 'Suburban Rides', city: 'Phoenix', owner: 'David Williams', verified: false },
];

const ShopsTable = ({ shops }: { shops: typeof shopsData }) => (
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
      {shops.map((shop) => (
        <TableRow key={shop.id}>
          <TableCell className="font-medium">{shop.name}</TableCell>
          <TableCell>{shop.city}</TableCell>
          <TableCell>{shop.owner}</TableCell>
          <TableCell>
            <Checkbox checked={shop.verified} aria-label="Verified" />
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
                <DropdownMenuItem>Block</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);


function ShopsPageContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';

  const verifiedShops = shopsData.filter(shop => shop.verified);
  const pendingShops = shopsData.filter(shop => !shop.verified);

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
              <ShopsTable shops={shopsData} />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Verified Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={verifiedShops} />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={pendingShops} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Shops</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No blocked shops.</p>
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
