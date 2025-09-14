

"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Eye, CheckCircle, XCircle, Edit, Trash2, Ban } from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { UserProfileDialog } from './user-profile-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/common/pagination';


export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  totalRentals: number;
  cancellations: number;
  lifetimeSpend: number;
  status: 'active' | 'inactive' | 'blocked';
  walletBalance: number;
  lastLogin: string;
  loyalty: 'Gold' | 'Silver' | 'Bronze' | null;
  profilePhotoUrl: string;
};

const initialUsersData: User[] = [
  { id: 'U001', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', isVerified: true, totalRentals: 15, cancellations: 1, lifetimeSpend: 12500, status: 'active', walletBalance: 500, lastLogin: '2024-07-22T10:00:00Z', loyalty: 'Gold', profilePhotoUrl: 'https://picsum.photos/id/1005/100/100' },
  { id: 'U002', name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', isVerified: false, totalRentals: 5, cancellations: 0, lifetimeSpend: 4500, status: 'active', walletBalance: 200, lastLogin: '2024-07-21T15:30:00Z', loyalty: 'Silver', profilePhotoUrl: 'https://picsum.photos/id/1006/100/100' },
  { id: 'U003', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', isVerified: true, totalRentals: 2, cancellations: 2, lifetimeSpend: 1200, status: 'inactive', walletBalance: 0, lastLogin: '2024-06-15T11:20:00Z', loyalty: 'Bronze', profilePhotoUrl: 'https://picsum.photos/id/1008/100/100' },
  { id: 'U004', name: 'Diana Miller', email: 'diana@example.com', phone: '456-789-0123', isVerified: true, totalRentals: 25, cancellations: 0, lifetimeSpend: 25000, status: 'active', walletBalance: 1500, lastLogin: '2024-07-22T08:45:00Z', loyalty: 'Gold', profilePhotoUrl: 'https://picsum.photos/id/1011/100/100' },
  { id: 'U005', name: 'Ethan Davis', email: 'ethan@example.com', phone: '567-890-1234', isVerified: false, totalRentals: 0, cancellations: 0, lifetimeSpend: 0, status: 'blocked', walletBalance: 0, lastLogin: '2024-05-01T18:00:00Z', loyalty: null, profilePhotoUrl: 'https://picsum.photos/id/1012/100/100' },
  { id: 'U006', name: 'Fiona Green', email: 'fiona@example.com', phone: '678-901-2345', isVerified: true, totalRentals: 12, cancellations: 0, lifetimeSpend: 9800, status: 'active', walletBalance: 300, lastLogin: '2024-07-23T11:00:00Z', loyalty: 'Silver', profilePhotoUrl: 'https://picsum.photos/id/1013/100/100' },
  { id: 'U007', name: 'George White', email: 'george@example.com', phone: '789-012-3456', isVerified: false, totalRentals: 1, cancellations: 1, lifetimeSpend: 300, status: 'inactive', walletBalance: 0, lastLogin: '2024-07-01T09:00:00Z', loyalty: null, profilePhotoUrl: 'https://picsum.photos/id/1014/100/100' },
  { id: 'U008', name: 'Hannah Black', email: 'hannah@example.com', phone: '890-123-4567', isVerified: true, totalRentals: 30, cancellations: 2, lifetimeSpend: 32000, status: 'active', walletBalance: 2500, lastLogin: '2024-07-23T10:30:00Z', loyalty: 'Gold', profilePhotoUrl: 'https://picsum.photos/id/1015/100/100' },
  { id: 'U009', name: 'Ian Blue', email: 'ian@example.com', phone: '901-234-5678', isVerified: false, totalRentals: 0, cancellations: 0, lifetimeSpend: 0, status: 'active', walletBalance: 0, lastLogin: '2024-07-23T12:00:00Z', loyalty: null, profilePhotoUrl: 'https://picsum.photos/id/1016/100/100' },
  { id: 'U010', name: 'Jack Grey', email: 'jack@example.com', phone: '012-345-6789', isVerified: true, totalRentals: 8, cancellations: 0, lifetimeSpend: 6700, status: 'active', walletBalance: 100, lastLogin: '2024-07-22T18:00:00Z', loyalty: 'Bronze', profilePhotoUrl: 'https://picsum.photos/id/1018/100/100' },
  { id: 'U011', name: 'Karen Brown', email: 'karen@example.com', phone: '112-233-4455', isVerified: true, totalRentals: 3, cancellations: 3, lifetimeSpend: 1500, status: 'blocked', walletBalance: 0, lastLogin: '2024-06-30T14:00:00Z', loyalty: null, profilePhotoUrl: 'https://picsum.photos/id/1019/100/100' },
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
        {trigger}
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


function UsersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  const page = searchParams.get('page') || '1';
  
  const [currentSearch, setCurrentSearch] = useState(searchParams.get('search') || "");
  const [users, setUsers] = useState(initialUsersData);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '' });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );
  
  const handleTabChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('tab', value)}&${createQueryString('page','1')}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCurrentSearch(value);
    const newQuery = createQueryString('search', value);
    router.push(`${pathname}?${newQuery}`, { scroll: false });
  };
  
  useEffect(() => {
    setCurrentSearch(searchParams.get('search') || "");
  }, [searchParams]);

  const handleDelete = (userId: string, reason: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: `Notification sent to user with reason: ${reason}`,
      variant: "destructive"
    });
  };

  const handleBlock = (userId: string, reason: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'blocked' } : user
    ));
    toast({
      title: "User Blocked",
      description: `Notification sent to user with reason: ${reason}`,
    });
  };

  const handleUnblock = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    toast({
      title: "User Unblocked",
      description: `User has been unblocked and is now active.`,
    })
  };

  const handleEditOpen = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleEditSave = () => {
    if (editingUser) {
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      toast({
        title: "User Updated",
        description: `User details for ${editingUser.name} have been updated.`,
      });
    }
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleAddUser = () => {
    const newUserData: User = {
      id: `U${Date.now().toString(36)}${Math.random().toString(36).substring(2, 5)}`.toUpperCase(),
      ...newUser,
      isVerified: false,
      totalRentals: 0,
      cancellations: 0,
      lifetimeSpend: 0,
      status: 'active',
      walletBalance: 0,
      lastLogin: new Date().toISOString(),
      loyalty: null,
      profilePhotoUrl: 'https://picsum.photos/100/100'
    };
    setUsers([newUserData, ...users]);
    setIsAddDialogOpen(false);
    setNewUser({ name: '', email: '', phone: '' });
    toast({
      title: "User Added",
      description: `${newUser.name} has been added with an active status.`,
    });
  };

  const handleVerificationChange = (userId: string, verified: boolean) => {
    setUsers(users.map(user => user.id === userId ? { ...user, isVerified: verified } : user));
    toast({
        title: `User ${verified ? 'Verified' : 'Unverified'}`,
        description: `An email and SMS notification has been sent to the user.`,
    });
  };
  
  const filteredUsers = useMemo(() => {
    let results = users;
    const searchTerm = searchParams.get('search') || "";

    if (tab && tab !== 'all') {
      if (tab === 'verified') {
        results = results.filter(u => u.isVerified);
      } else {
        results = results.filter(u => u.status === tab);
      }
    }
    
    if (searchTerm) {
        results = results.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return results;
  }, [users, tab, searchParams]);

  const currentPage = parseInt(page, 10);
  const itemsPerPage = 10;
  const paginatedUsers = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <PageHeader title="Users Management">
           <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name, email, phone..."
                    className="pl-8 w-full sm:w-64"
                    value={currentSearch}
                    onChange={handleSearchChange}
                />
            </div>
            <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </DialogTrigger>
           </div>
        </PageHeader>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-name" className="text-right">Name</Label>
              <Input id="add-name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="col-span-3"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-email" className="text-right">Email</Label>
              <Input id="add-email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="col-span-3"/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="add-phone" className="text-right">Phone</Label>
              <Input id="add-phone" type="tel" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="col-span-3"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="overflow-x-auto whitespace-nowrap h-auto justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-0">
             {paginatedUsers.length > 0 ? (
                 <div className="overflow-x-auto">
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Total Rentals</TableHead>
                        <TableHead>Cancellations</TableHead>
                        <TableHead>Lifetime Spend</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                <div className="text-sm text-muted-foreground">{user.phone}</div>
                            </TableCell>
                             <TableCell>
                                <Checkbox 
                                    checked={user.isVerified} 
                                    onCheckedChange={(checked) => handleVerificationChange(user.id, !!checked)}
                                />
                            </TableCell>
                            <TableCell>{user.totalRentals}</TableCell>
                            <TableCell>{user.cancellations > 0 ? (
                                <Button variant="link" className="p-0 h-auto">{user.cancellations}</Button>
                            ) : 0}</TableCell>
                            <TableCell>₹{user.lifetimeSpend.toLocaleString()}</TableCell>
                            <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : user.status === 'blocked' ? 'destructive' : 'secondary'}>
                                {user.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setViewingUser(user)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditOpen(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    
                                    {user.isVerified ? (
                                        <Button variant="ghost" size="icon" onClick={() => handleVerificationChange(user.id, false)}>
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => handleVerificationChange(user.id, true)}>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </Button>
                                    )}

                                    {user.status !== 'blocked' ? (
                                        <ActionDialog
                                            trigger={
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            }
                                            title="Are you sure you want to block this user?"
                                            description="This action will prevent the user from using the app. Please provide a reason."
                                            onAction={(reason) => handleBlock(user.id, reason)}
                                            destructive
                                        />
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => handleUnblock(user.id)}>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </Button>
                                    )}
                                    <ActionDialog
                                        trigger={
                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        }
                                        title="Are you absolutely sure?"
                                        description="This action cannot be undone. This will permanently delete the user. Please provide a reason."
                                        onAction={(reason) => handleDelete(user.id, reason)}
                                        destructive={true}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    currentPage={currentPage}
                    totalCount={filteredUsers.length}
                    pageSize={itemsPerPage}
                    path={pathname}
                />
                </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">No users found matching the criteria.</div>
            )}
          </CardContent>
        </Card>
      </Tabs>

       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="col-span-3"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input id="edit-email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="col-span-3"/>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                <Input id="edit-phone" type="tel" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className="col-span-3"/>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleEditSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UserProfileDialog user={viewingUser} onOpenChange={(open) => !open && setViewingUser(null)} />
    </>
  );
}


export default function UsersPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <UsersPageContent />
        </React.Suspense>
    )
}
