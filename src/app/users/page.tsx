"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { UserProfileDrawer } from '@/components/users/user-profile-drawer';
import { Checkbox } from '@/components/ui/checkbox';


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
];


function ActionDialog({
  triggerText,
  title,
  description,
  onAction,
  destructive = false
}: {
  triggerText: React.ReactNode,
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
          {triggerText}
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


function UsersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';
  
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
    router.push(`${pathname}?${createQueryString('tab', value)}`);
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

  return (
    <DashboardLayout>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <PageHeader title="Users Management">
           <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name, email, phone..."
                    className="pl-8 w-64"
                    value={currentSearch}
                    onChange={handleSearchChange}
                />
            </div>
            <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)}>
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
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-0">
             {filteredUsers.length > 0 ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead>Total Rentals</TableHead>
                        <TableHead>Cancellations</TableHead>
                        <TableHead>Lifetime Spend</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
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
                                <DropdownMenuItem onClick={() => setViewingUser(user)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditOpen(user)}>Edit</DropdownMenuItem>
                                
                                {user.isVerified ? (
                                    <DropdownMenuItem onClick={() => handleVerificationChange(user.id, false)}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Unverify
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => handleVerificationChange(user.id, true)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verify
                                    </DropdownMenuItem>
                                )}

                                {user.status !== 'blocked' ? (
                                    <ActionDialog
                                        triggerText="Block"
                                        title="Are you sure you want to block this user?"
                                        description="This action will prevent the user from using the app. Please provide a reason."
                                        onAction={(reason) => handleBlock(user.id, reason)}
                                        destructive
                                    />
                                ) : (
                                    <DropdownMenuItem onClick={() => handleUnblock(user.id)}>Unblock</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <ActionDialog
                                    triggerText="Delete"
                                    title="Are you absolutely sure?"
                                    description="This action cannot be undone. This will permanently delete the user. Please provide a reason."
                                    onAction={(reason) => handleDelete(user.id, reason)}
                                    destructive={true}
                                />
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
      <UserProfileDrawer user={viewingUser} onOpenChange={(open) => !open && setViewingUser(null)} />
    </DashboardLayout>
  );
}


export default function UsersPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <UsersPageContent />
        </React.Suspense>
    )
}
