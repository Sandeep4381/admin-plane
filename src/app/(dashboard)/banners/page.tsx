
"use client";

import React, { useState, useMemo } from 'react';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Trash2, Edit, TrendingUp, Eye, MousePointerClick, PowerOff, Power } from "lucide-react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from "react-day-picker";

type BannerStatus = 'active' | 'scheduled' | 'expired' | 'disabled';
type BannerPlacement = 'homepage' | 'offers_page' | 'popup' | 'seasonal';

type Banner = {
  id: string;
  imageUrl: string;
  placement: BannerPlacement;
  redirectLink: string;
  validity: DateRange;
  status: BannerStatus;
  impressions: number;
  clicks: number;
};

const initialBanners: Banner[] = [
  { id: 'BNR001', imageUrl: 'https://picsum.photos/800/400?random=1', placement: 'homepage', redirectLink: '/offers', validity: { from: new Date('2024-07-01'), to: new Date('2024-07-31') }, status: 'active', impressions: 150000, clicks: 7500 },
  { id: 'BNR002', imageUrl: 'https://picsum.photos/800/400?random=2', placement: 'offers_page', redirectLink: '/offers/monsoon-bonanza', validity: { from: new Date('2024-07-15'), to: new Date('2024-08-15') }, status: 'active', impressions: 80000, clicks: 6400 },
  { id: 'BNR003', imageUrl: 'https://picsum.photos/800/400?random=3', placement: 'popup', redirectLink: '/users/verify', validity: { from: new Date('2024-08-01'), to: new Date('2024-08-10') }, status: 'scheduled', impressions: 0, clicks: 0 },
  { id: 'BNR004', imageUrl: 'https://picsum.photos/800/400?random=4', placement: 'homepage', redirectLink: '/offers/summer-sale', validity: { from: new Date('2024-06-01'), to: new Date('2024-06-30') }, status: 'expired', impressions: 250000, clicks: 12500 },
  { id: 'BNR005', imageUrl: 'https://picsum.photos/800/400?random=5', placement: 'seasonal', redirectLink: '/offers/diwali-special', validity: { from: new Date('2024-07-20'), to: new Date('2024-07-25') }, status: 'disabled', impressions: 50000, clicks: 1200 },
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

function BannerDialog({ trigger, banner, onSave }: { trigger: React.ReactNode, banner?: Banner, onSave: (banner: Omit<Banner, 'impressions' | 'clicks' | 'status'> & { status?: BannerStatus }) => void }) {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<BannerPlacement>(banner?.placement || 'homepage');
    const [redirectLink, setRedirectLink] = useState(banner?.redirectLink || '');
    const [validity, setValidity] = useState<DateRange | undefined>(banner?.validity);
    const { toast } = useToast();

    const handleSave = () => {
        if (!redirectLink || !validity?.from || !validity?.to) {
             toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const newOrUpdatedBanner = {
            id: banner?.id || `BNR${Date.now()}`,
            imageUrl: banner?.imageUrl || `https://picsum.photos/800/400?random=${Date.now()}`,
            placement,
            redirectLink,
            validity,
        };

        onSave(newOrUpdatedBanner);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{banner ? 'Edit Banner' : 'Upload New Banner'}</DialogTitle>
                    <DialogDescription>Configure the banner details and scheduling.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Banner Preview</Label>
                        <div className="mt-2 relative aspect-video w-full rounded-md border" data-ai-hint="advertisement banner">
                            <Image src={banner?.imageUrl || 'https://picsum.photos/800/400'} alt="Banner preview" fill className="object-cover rounded-md" />
                        </div>
                        <Input type="file" className="mt-2" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="placement" className="text-right">Placement</Label>
                        <Select onValueChange={(v: BannerPlacement) => setPlacement(v)} defaultValue={placement}>
                            <SelectTrigger id="placement" className="col-span-3">
                                <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="homepage">Homepage</SelectItem>
                                <SelectItem value="offers_page">Offers Page</SelectItem>
                                <SelectItem value="popup">App Popup</SelectItem>
                                <SelectItem value="seasonal">Seasonal Campaign</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="link" className="text-right">Redirect Link</Label>
                        <Input id="link" value={redirectLink} onChange={(e) => setRedirectLink(e.target.value)} className="col-span-3" placeholder="/offers/special" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Validity</Label>
                        <div className="col-span-3">
                           <DatePickerWithRange date={validity} onDateChange={setValidity} />
                        </div>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>{banner ? 'Save Changes' : 'Upload Banner'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function BannersPage() {
  const [banners, setBanners] = useState(initialBanners);
  const { toast } = useToast();

  const handleSaveBanner = (bannerData: Omit<Banner, 'impressions' | 'clicks' | 'status'> & { status?: BannerStatus }) => {
      const isEditing = banners.some(b => b.id === bannerData.id);

      const getStatus = (): BannerStatus => {
            const now = new Date();
            now.setHours(0,0,0,0);
            if (bannerData.validity.from && now < bannerData.validity.from) return 'scheduled';
            if (bannerData.validity.to && now > bannerData.validity.to) return 'expired';
            return 'active';
        }

      if (isEditing) {
          setBanners(banners.map(b => b.id === bannerData.id ? { ...b, ...bannerData, status: bannerData.status || getStatus() } : b));
          toast({ title: "Banner Updated", description: "The banner details have been successfully updated." });
      } else {
          const newBanner: Banner = {
              ...bannerData,
              impressions: 0,
              clicks: 0,
              status: getStatus()
          };
          setBanners([newBanner, ...banners]);
          toast({ title: "Banner Uploaded", description: "The new banner has been successfully uploaded and scheduled." });
      }
  };

  const handleDeleteBanner = (bannerId: string) => {
      setBanners(banners.filter(b => b.id !== bannerId));
      toast({ title: "Banner Deleted", variant: "destructive" });
  };
  
  const handleToggleStatus = (banner: Banner) => {
      const newStatus = banner.status === 'disabled' ? 'active' : 'disabled';
      setBanners(banners.map(b => b.id === banner.id ? { ...b, status: newStatus } : b));
      toast({ title: `Banner ${newStatus === 'active' ? 'Enabled' : 'Disabled'}` });
  }

  const { totalClicks, ctr } = useMemo(() => {
    const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);
    const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    return { totalClicks, ctr: ctr.toFixed(2) };
  }, [banners]);

  return (
    <>
      <PageHeader title="Banners">
        <BannerDialog
            trigger={<Button><PlusCircle className="mr-2 h-4 w-4" /> Upload Banner</Button>}
            onSave={handleSaveBanner}
        />
      </PageHeader>
      
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Banners" value={banners.length.toString()} icon={Eye} />
            <StatCard title="Active Banners" value={banners.filter(b => b.status === 'active').length.toString()} icon={TrendingUp} />
            <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} />
            <StatCard title="Overall CTR" value={`${ctr}%`} icon={TrendingUp} />
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Manage Banners</CardTitle>
                <CardDescription>
                Upload, manage, and track promotional banners for your user app.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Placement</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Validity</TableHead>
                            <TableHead>Clicks / Impressions</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.map((banner) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    <div className="relative h-10 w-20 rounded-md border" data-ai-hint="advertisement banner">
                                        <Image src={banner.imageUrl} alt="Banner" fill className="object-cover rounded-md" />
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{banner.placement.replace('_', ' ')}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        banner.status === 'active' ? 'default' :
                                        banner.status === 'disabled' ? 'destructive' :
                                        'secondary'
                                    } className="capitalize">{banner.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(banner.validity.from as Date).toLocaleDateString()} - {new Date(banner.validity.to as Date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {banner.clicks.toLocaleString()} / {banner.impressions.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <BannerDialog
                                                trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>}
                                                banner={banner}
                                                onSave={handleSaveBanner}
                                            />
                                            <DropdownMenuItem onClick={() => handleToggleStatus(banner)}>
                                                {banner.status === 'disabled' ? <><Power className="mr-2 h-4 w-4" /> Enable</> : <><PowerOff className="mr-2 h-4 w-4" /> Disable</>}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteBanner(banner.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
