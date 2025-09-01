"use client";

import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Shop = {
  id: string;
  name: string;
  city: string;
  owner: string;
  verified: boolean;
  status: 'verified' | 'pending' | 'blocked' | 'restricted';
};

const initialShopsData: Shop[] = [
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
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [newShop, setNewShop] = useState({ name: '', city: '', owner: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleDelete = (shopId: string, reason: string) => {
    setShops(shops.filter(shop => shop.id !== shopId));
    toast({
      title: "Shop Deleted",
      description: `Notification sent to shop owner with reason: ${reason}`,
    })
  };

  const handleBlock = (shopId: string, reason: string) => {
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, status: 'blocked' } : shop
    ));
    toast({
      title: "Shop Blocked",
      description: `Notification sent to shop owner with reason: ${reason}`,
    })
  };
  
  const handleUnblock = (shopId: string) => {
    setShops(shops.map(shop =>
      shop.id === shopId ? { ...shop, status: 'pending' } : shop
    ));
    toast({
      title: "Shop Unblocked",
      description: `Shop has been unblocked and notified.`,
    })
  };

  const handleRestrict = (shopId: string, reason: string) => {
    setShops(shops.map(shop =>
      shop.id === shopId ? { ...shop, status: 'restricted' } : shop
    ));
    toast({
      title: "Shop Restricted",
      description: `Notification sent to shop owner with reason: ${reason}`,
    })
  };

  const handleEditOpen = (shop: Shop) => {
    setEditingShop(shop);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSave = () => {
    if (editingShop) {
      setShops(shops.map(shop => (shop.id === editingShop.id ? editingShop : shop)));
      toast({
        title: "Shop Updated",
        description: `Shop details for ${editingShop.name} have been updated.`,
      })
    }
    setIsEditDialogOpen(false);
    setEditingShop(null);
  };

  const handleAddShop = () => {
    const newShopData: Shop = {
      id: `S${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`.toUpperCase(),
      ...newShop,
      verified: false,
      status: 'pending'
    };
    setShops([...shops, newShopData]);
    setIsAddDialogOpen(false);
    setNewShop({ name: '', city: '', owner: '' });
    toast({
      title: "Shop Added",
      description: `${newShop.name} has been added and is pending verification.`,
    })
  };

  const filteredShops = (status: string) => {
    let shopsByStatus = shops;
    if (status === 'all') shopsByStatus = shops.filter(s => s.status !== 'blocked');
    else if (status === 'verified') shopsByStatus = shops.filter(s => s.status === 'verified');
    else if (status === 'pending') shopsByStatus = shops.filter(s => s.status === 'pending');
    else if (status === 'blocked') shopsByStatus = shops.filter(s => s.status === 'blocked');
    else if (status === 'restricted') shopsByStatus = shops.filter(s => s.status === 'restricted');

    if (searchTerm) {
        return shopsByStatus.filter(shop => shop.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return shopsByStatus;
  }

  const ShopsTable = ({ shops, tab }: { shops: Shop[], tab: string }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop ID</TableHead>
          <TableHead>Shop Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead>Status</TableHead>
          <TableHead><span className="sr-only">Actions</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredShops(tab).map((shop) => (
          <TableRow key={shop.id}>
            <TableCell className="font-medium">{shop.id}</TableCell>
            <TableCell className="font-medium">{shop.name}</TableCell>
            <TableCell>{shop.city}</TableCell>
            <TableCell>{shop.owner}</TableCell>
            <TableCell>
              <Checkbox checked={shop.verified} aria-label="Verified" disabled />
            </TableCell>
            <TableCell className="capitalize">{shop.status}</TableCell>
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
                  {shop.status !== 'blocked' && <DropdownMenuItem onClick={() => handleEditOpen(shop)}>Edit</DropdownMenuItem>}
                  
                  {shop.status !== 'blocked' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Restrict</DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to restrict this shop?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will limit the shop's visibility or functionality. Please provide a reason.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea placeholder="Reason for restriction..." value={reason} onChange={(e) => setReason(e.target.value)} />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { handleRestrict(shop.id, reason); setReason(''); }}>Restrict</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  
                  {shop.status !== 'blocked' ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Block</DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to block this shop?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will prevent the shop from appearing in the app. Please provide a reason.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Textarea placeholder="Reason for blocking..." value={reason} onChange={(e) => setReason(e.target.value)} />
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { handleBlock(shop.id, reason); setReason(''); }}>Block</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <DropdownMenuItem onClick={() => handleUnblock(shop.id)}>Unblock</DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the shop. Please provide a reason.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                       <Textarea placeholder="Reason for deletion..." value={reason} onChange={(e) => setReason(e.target.value)} />
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => {handleDelete(shop.id, reason); setReason('');}}>Delete</AlertDialogAction>
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
       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <PageHeader title="Shops" >
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search shops..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Shop
                </Button>
            </DialogTrigger>
        </PageHeader>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Shop</DialogTitle>
            <DialogDescription>
              Enter the details for the new shop. It will be added with a 'pending' status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">Name</Label>
              <Input id="add-name" value={newShop.name} onChange={(e) => setNewShop({ ...newShop, name: e.target.value })} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-city" className="text-right">City</Label>
              <Input id="add-city" value={newShop.city} onChange={(e) => setNewShop({ ...newShop, city: e.target.value })} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-owner" className="text-right">Owner</Label>
              <Input id="add-owner" value={newShop.owner} onChange={(e) => setNewShop({ ...newShop, owner: e.target.value })} className="col-span-3"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddShop}>Add Shop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Tabs defaultValue={tab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="restricted">Restricted</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Shops</CardTitle>
              <CardDescription>A list of all non-blocked shops on the platform.</CardDescription>
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
              <CardDescription>Shops that have completed the verification process.</CardDescription>
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
              <CardDescription>Shops awaiting verification from the admin team.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShopsTable shops={shops} tab="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="restricted">
          <Card>
            <CardHeader>
              <CardTitle>Restricted Shops</CardTitle>
              <CardDescription>Shops with limited visibility or functionality.</CardDescription>
            </CardHeader>
            <CardContent>
               {filteredShops('restricted').length > 0 ? (
                <ShopsTable shops={shops} tab="restricted" />
              ) : (
                <p>No restricted shops.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blocked">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Shops</CardTitle>
              <CardDescription>Shops that have been blocked from the platform.</CardDescription>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Make changes to the shop details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingShop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingShop.name}
                  onChange={(e) => setEditingShop({ ...editingShop, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={editingShop.city}
                  onChange={(e) => setEditingShop({ ...editingShop, city: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="owner" className="text-right">
                  Owner
                </Label>
                <Input
                  id="owner"
                  value={editingShop.owner}
                  onChange={(e) => setEditingShop({ ...editingShop, owner: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleEditSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

    
