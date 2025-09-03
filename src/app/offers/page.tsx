"use client";

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Edit, TrendingUp, Percent, Tag, Users, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { DateRange } from "react-day-picker"

type OfferStatus = 'active' | 'scheduled' | 'expired';
type OfferType = 'percentage' | 'flat' | 'free_km';
type OfferTarget = 'all' | 'new' | 'verified' | 'inactive';

type Offer = {
  id: string;
  name: string;
  type: OfferType;
  discountValue: number;
  validity: DateRange;
  targetAudience: OfferTarget;
  usageCount: number;
  budgetUsed: number;
  status: OfferStatus;
};

const initialOffers: Offer[] = [
  { id: 'OFF001', name: 'Monsoon Bonanza', type: 'percentage', discountValue: 20, validity: { from: new Date('2024-07-01'), to: new Date('2024-07-31') }, targetAudience: 'all', usageCount: 1500, budgetUsed: 75000, status: 'active' },
  { id: 'OFF002', name: 'First Ride Free', type: 'flat', discountValue: 150, validity: { from: new Date('2024-07-15'), to: new Date('2024-08-15') }, targetAudience: 'new', usageCount: 800, budgetUsed: 120000, status: 'active' },
  { id: 'OFF003', name: 'Independence Day Special', type: 'percentage', discountValue: 15, validity: { from: new Date('2024-08-14'), to: new Date('2024-08-16') }, targetAudience: 'all', usageCount: 0, budgetUsed: 0, status: 'scheduled' },
  { id: 'OFF004', name: 'Summer Sale', type: 'percentage', discountValue: 10, validity: { from: new Date('2024-06-01'), to: new Date('2024-06-30') }, targetAudience: 'all', usageCount: 2500, budgetUsed: 125000, status: 'expired' },
  { id: 'OFF005', name: 'Welcome Back', type: 'flat', discountValue: 50, validity: { from: new Date('2024-07-01'), to: new Date('2024-09-30') }, targetAudience: 'inactive', usageCount: 250, budgetUsed: 12500, status: 'active' },
];

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
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


function OfferDialog({ trigger, offer, onSave }: { trigger: React.ReactNode, offer?: Offer | null, onSave: (offer: Offer) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(offer?.name || '');
    const [type, setType] = useState<OfferType>(offer?.type || 'percentage');
    const [discountValue, setDiscountValue] = useState(offer?.discountValue || 0);
    const [validity, setValidity] = useState<DateRange | undefined>(offer?.validity || undefined);
    const [targetAudience, setTargetAudience] = useState<OfferTarget>(offer?.targetAudience || 'all');
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !discountValue || !validity?.from || !validity?.to) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }
        
        const getStatus = (): OfferStatus => {
            const now = new Date();
            if (validity.from && now < validity.from) return 'scheduled';
            if (validity.to && now > validity.to) return 'expired';
            return 'active';
        }

        const newOrUpdatedOffer: Offer = {
            id: offer?.id || `OFF${Date.now()}`,
            name,
            type,
            discountValue,
            validity,
            targetAudience,
            usageCount: offer?.usageCount || 0,
            budgetUsed: offer?.budgetUsed || 0,
            status: offer?.status || getStatus(),
        };
        onSave(newOrUpdatedOffer);
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{offer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your promotional offer.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select onValueChange={(v: OfferType) => setType(v)} defaultValue={type}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select offer type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">% Discount</SelectItem>
                                <SelectItem value="flat">Flat Amount</SelectItem>
                                <SelectItem value="free_km">Free KM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">Value</Label>
                        <Input id="value" type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Validity</Label>
                        <div className="col-span-3">
                            <DatePickerWithRange date={validity} onDateChange={setValidity} />
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="target" className="text-right">Target</Label>
                        <Select onValueChange={(v: OfferTarget) => setTargetAudience(v)} defaultValue={targetAudience}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select target audience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="new">New Users</SelectItem>
                                <SelectItem value="verified">Verified Users</SelectItem>
                                <SelectItem value="inactive">Inactive Users</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Offer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeleteDialog({ onConfirm }: { onConfirm: () => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the offer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default function OffersPage() {
    const [offers, setOffers] = useState(initialOffers);
    const { toast } = useToast();

    const handleSaveOffer = (offer: Offer) => {
        const isEditing = offers.some(o => o.id === offer.id);
        if (isEditing) {
            setOffers(offers.map(o => o.id === offer.id ? offer : o));
            toast({ title: "Offer Updated", description: `${offer.name} has been successfully updated.` });
        } else {
            setOffers([offer, ...offers]);
            toast({ title: "Offer Created", description: `${offer.name} has been successfully created and scheduled.` });
        }
    };

    const handleDeleteOffer = (offerId: string) => {
        setOffers(offers.filter(o => o.id !== offerId));
        toast({ title: "Offer Deleted", description: "The offer has been permanently deleted.", variant: "destructive" });
    }

    const filteredOffers = useMemo(() => ({
        active: offers.filter(o => o.status === 'active'),
        scheduled: offers.filter(o => o.status === 'scheduled'),
        expired: offers.filter(o => o.status === 'expired'),
    }), [offers]);

  return (
    <DashboardLayout>
      <PageHeader title="Offers & Campaigns">
        <OfferDialog
            trigger={<Button><PlusCircle className="mr-2 h-4 w-4" />Create New Offer</Button>}
            onSave={handleSaveOffer}
        />
      </PageHeader>
      
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Redemptions" value="2,550" icon={Tag} />
                    <StatCard title="Conversion Rate" value="12.5%" icon={Percent} />
                    <StatCard title="Revenue Impact" value="₹1,20,500" icon={TrendingUp} />
                    <StatCard title="Active Campaigns" value={filteredOffers.active.length.toString()} icon={Calendar} />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Offers</CardTitle>
                        <CardDescription>Monitor and manage your currently active offers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OffersTable offers={filteredOffers.active} onSave={handleSaveOffer} onDelete={handleDeleteOffer} />
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
         <TabsContent value="scheduled">
            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Offers</CardTitle>
                    <CardDescription>These offers are scheduled to go live in the future.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OffersTable offers={filteredOffers.scheduled} onSave={handleSaveOffer} onDelete={handleDeleteOffer} />
                </CardContent>
            </Card>
         </TabsContent>
         <TabsContent value="expired">
            <Card>
                <CardHeader>
                    <CardTitle>Expired Offers</CardTitle>
                    <CardDescription>These offers have already ended.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OffersTable offers={filteredOffers.expired} onSave={handleSaveOffer} onDelete={handleDeleteOffer} />
                </CardContent>
            </Card>
         </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}


function OffersTable({ offers, onSave, onDelete }: { offers: Offer[], onSave: (offer: Offer) => void, onDelete: (id: string) => void }) {
    
    const formatDiscount = (type: OfferType, value: number) => {
        switch(type) {
            case 'percentage': return `${value}% OFF`;
            case 'flat': return `₹${value} OFF`;
            case 'free_km': return `${value} Free KM`;
            default: return value;
        }
    }

    const formatDate = (date: Date) => new Date(date).toLocaleDateString();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Offer Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {offers.map(offer => (
                    <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.name}</TableCell>
                        <TableCell className="capitalize">{offer.type.replace('_', ' ')}</TableCell>
                        <TableCell>{formatDiscount(offer.type, offer.discountValue)}</TableCell>
                        <TableCell>{formatDate(offer.validity.from as Date)} - {formatDate(offer.validity.to as Date)}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{offer.targetAudience}</Badge></TableCell>
                        <TableCell>{offer.usageCount.toLocaleString()}</TableCell>
                        <TableCell>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <OfferDialog
                                        trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>}
                                        offer={offer}
                                        onSave={onSave}
                                    />
                                    <DropdownMenuSeparator />
                                    <DeleteDialog onConfirm={() => onDelete(offer.id)} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
