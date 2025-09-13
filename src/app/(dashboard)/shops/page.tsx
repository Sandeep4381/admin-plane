
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle, Search, CheckCircle, XCircle, Ban, Edit, Trash2, KeyRound } from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type Shop = {
  id: string;
  name: string;
  city: string;
  owner: string;
  verified: boolean;
  status: 'verified' | 'pending' | 'blocked' | 'restricted' | 'rejected';
  documentUrl?: string;
  shopImageUrl?: string;
};

const initialShopsData: Shop[] = [
  { id: 'S001', name: 'Deluxe Car Rentals', city: 'New York', owner: 'John Doe', verified: true, status: 'verified', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S002', name: 'Speedy Bikes', city: 'Los Angeles', owner: 'Jane Smith', verified: true, status: 'verified', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S003', name: 'City Scooters', city: 'Chicago', owner: 'Peter Jones', verified: false, status: 'pending', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S004', name: 'Metro Auto', city: 'Houston', owner: 'Mary Johnson', verified: true, status: 'verified', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S005', name: 'Suburban Rides', city: 'Phoenix', owner: 'David Williams', verified: false, status: 'pending', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S006', name: 'Blocked Wheels', city: 'Miami', owner: 'Frank White', verified: false, status: 'blocked', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
  { id: 'S007', name: 'Rejected Rides', city: 'Seattle', owner: 'Grace Hall', verified: false, status: 'rejected', documentUrl: 'https://picsum.photos/400/300', shopImageUrl: 'https://picsum.photos/400/300' },
];

function ActionDialog({
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
        <DropdownMenuItem 
          className={destructive ? "text-destructive" : ""}
          onSelect={(e) => e.preventDefault()}
        >
          {trigger}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea placeholder="Reason for this action..." value={reason} onChange={(e) => setReason(e.target.value)} />
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


function ShopsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  
  const [currentSearch, setCurrentSearch] = useState(searchParams.get('search') || "");

  const [shops, setShops] = useState(initialShopsData);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [verifyingShop, setVerifyingShop] = useState<Shop | null>(null);
  const [newShop, setNewShop] = useState({ name: '', city: '', owner: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  
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
    const value = event.currentTarget.value;
    setCurrentSearch(value);
    router.push(`${pathname}?${createQueryString('search', value)}`, { scroll: false });
  };
  
  useEffect(() => {
    setCurrentSearch(searchParams.get('search') || "");
  }, [searchParams]);

  const handleDelete = (shopId: string, reason: string) => {
    setShops(shops.filter(shop => shop.id !== shopId));
    toast({
      title: "Shop Deleted",
      description: `Notification sent to shop owner with reason: ${reason}`,
      variant: "destructive"
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
      shop.id === shopId ? { ...shop, status: 'verified', verified: true } : shop
    ));
    toast({
      title: "Shop Unblocked",
      description: `Shop has been unblocked and is now verified.`,
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

  const handleVerifyOpen = (shop: Shop) => {
    setVerifyingShop(shop);
    setIsVerificationDialogOpen(true);
  };
  
  const handleApprove = (shopId: string) => {
    setShops(shops.map(shop => 
      shop.id === shopId ? { ...shop, status: 'verified', verified: true } : shop
    ));
    setIsVerificationDialogOpen(false);
    toast({
      title: "Shop Approved",
      description: "The shop has been successfully verified and a notification has been sent.",
    });
  };
  
  const handleReject = () => {
    if (verifyingShop) {
      setShops(shops.map(shop => 
        shop.id === verifyingShop.id ? { ...shop, status: 'rejected' } : shop
      ));
      setIsRejectionDialogOpen(false);
      setIsVerificationDialogOpen(false);
      toast({
        title: "Shop Rejected",
        description: `The shop has been rejected with reason: ${rejectionReason}`,
        variant: "destructive"
      });
      setRejectionReason("");
    }
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
  
  const pendingCount = useMemo(() => shops.filter(s => s.status === 'pending').length, [shops]);

  const filteredShops = useMemo(() => {
    let results = shops;
    const searchTerm = searchParams.get('search') || "";

    if (tab && tab !== 'all') {
      results = results.filter(s => s.status === tab);
    } else {
       results = results.filter(s => s.status !== 'blocked');
    }
    
    if (searchTerm) {
        results = results.filter(shop => shop.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    return results;
  }, [shops, tab, searchParams]);
  

  const ShopsTable = ({ shopsToShow }: { shopsToShow: Shop[] }) => (
    <div className="overflow-x-auto">
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
          {shopsToShow.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">{shop.id}</TableCell>
              <TableCell className="font-medium">{shop.name}</TableCell>
              <TableCell>{shop.city}</TableCell>
              <TableCell>{shop.owner}</TableCell>
              <TableCell>
                <Checkbox checked={shop.verified} aria-label="Verified" disabled />
              </TableCell>
              <TableCell>
                <Badge 
                  variant={shop.status === 'pending' ? 'secondary' : 'default'}
                  className={shop.status === 'pending' ? 'cursor-pointer' : ''}
                  onClick={() => shop.status === 'pending' && handleVerifyOpen(shop)}
                >
                  {shop.status}
                </Badge>
              </TableCell>
              <TableCell>
                {shop.status === 'pending' ? (
                  <Button variant="outline" size="sm" onClick={() => handleVerifyOpen(shop)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {shop.status !== 'blocked' && <DropdownMenuItem onClick={() => handleEditOpen(shop)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>}
                      
                      {shop.status !== 'blocked' && shop.status !== 'restricted' && (
                         <ActionDialog
                            trigger={<><KeyRound className="mr-2 h-4 w-4" />Restrict</>}
                            title="Are you sure you want to restrict this shop?"
                            description="This action will limit the shop's visibility or functionality. Please provide a reason."
                            onAction={(reason) => handleRestrict(shop.id, reason)}
                          />
                      )}
                      
                      {shop.status !== 'blocked' ? (
                         <ActionDialog
                            trigger={<><Ban className="mr-2 h-4 w-4" />Block</>}
                            title="Are you sure you want to block this shop?"
                            description="This action will prevent the shop from appearing in the app. Please provide a reason."
                            onAction={(reason) => handleBlock(shop.id, reason)}
                            destructive
                          />
                      ) : (
                        <DropdownMenuItem onClick={() => handleUnblock(shop.id)}><CheckCircle className="mr-2 h-4 w-4" />Unblock</DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <ActionDialog
                        trigger={<><Trash2 className="mr-2 h-4 w-4" />Delete</>}
                        title="Are you absolutely sure?"
                        description="This action cannot be undone. This will permanently delete the shop. Please provide a reason."
                        onAction={(reason) => handleDelete(shop.id, reason)}
                        destructive={true}
                      />

                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const ShopListContent = ({ title, description, shopsToShow }: { title: string, description: string, shopsToShow: Shop[] }) => (
     <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
         {shopsToShow.length > 0 ? (
          <ShopsTable shopsToShow={shopsToShow} />
        ) : (
          <p>No shops found matching the criteria.</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <PageHeader title="Shops" >
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search shops..."
                        className="pl-8 sm:w-64"
                        value={currentSearch}
                        onChange={handleSearchChange}
                    />
                </div>
                <DialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Shop
                    </Button>
                </DialogTrigger>
            </div>
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
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="overflow-x-auto whitespace-nowrap h-auto justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">
            <div className="relative">
                Pending
                {pendingCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="restricted">Restricted</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ShopListContent
            title="All Shops"
            description="A list of all non-blocked shops on the platform."
            shopsToShow={filteredShops}
          />
        </TabsContent>
         <TabsContent value="verified">
          <ShopListContent
            title="Verified Shops"
            description="Shops that have completed the verification process."
            shopsToShow={filteredShops}
          />
        </TabsContent>
         <TabsContent value="pending">
          <ShopListContent
            title="Pending Verification"
            description="Shops awaiting verification from the admin team."
            shopsToShow={filteredShops}
          />
        </TabsContent>
        <TabsContent value="restricted">
          <ShopListContent
            title="Restricted Shops"
            description="Shops with limited visibility or functionality."
            shopsToShow={filteredShops}
          />
        </TabsContent>
        <TabsContent value="blocked">
          <ShopListContent
            title="Blocked Shops"
            description="Shops that have been blocked from the platform."
            shopsToShow={filteredShops}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <ShopListContent
            title="Rejected Shops"
            description="Shops that did not meet the verification criteria."
            shopsToShow={filteredShops}
          />
        </TabsContent>
      </Tabs>
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Shop Verification</DialogTitle>
                <DialogDescription>Review the shop details and documents before making a decision.</DialogDescription>
            </DialogHeader>
            {verifyingShop && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold">{verifyingShop.name}</h4>
                        <p className="text-sm text-muted-foreground">Owner: {verifyingShop.owner}</p>
                        <p className="text-sm text-muted-foreground">City: {verifyingShop.city}</p>
                    </div>
                     <div className="space-y-2">
                        <Label>Submitted Documents</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative aspect-video rounded-md border" data-ai-hint="document image">
                               <Image src={verifyingShop.documentUrl || "https://picsum.photos/400/300"} alt="Document" fill className="object-cover rounded-md" />
                            </div>
                             <div className="relative aspect-video rounded-md border" data-ai-hint="shop image">
                                <Image src={verifyingShop.shopImageUrl || "https://picsum.photos/400/300"} alt="Shop" fill className="object-cover rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <DialogFooter className="grid grid-cols-2 gap-2">
                <Button variant="destructive" onClick={() => setIsRejectionDialogOpen(true)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                </Button>
                <Button onClick={() => verifyingShop && handleApprove(verifyingShop.id)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to reject this shop?</AlertDialogTitle>
                <AlertDialogDescription>Please provide a reason for rejection. This will be sent to the shop owner.</AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea placeholder="Reason for rejection..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReject} className="bg-destructive hover:bg-destructive/90">Reject Shop</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}

export default function ShopsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ShopsPageContent />
    </React.Suspense>
  );
}
