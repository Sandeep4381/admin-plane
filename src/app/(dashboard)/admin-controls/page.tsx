
"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Edit, UserX, Download, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Admin = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Manager' | 'Finance Head' | 'Operations Lead';
  lastLogin: string;
  status: 'active' | 'suspended';
};

const initialAdmins: Admin[] = [
  { id: 'ADM001', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', role: 'Super Admin', lastLogin: '2024-07-22 10:00 AM', status: 'active' },
  { id: 'ADM002', name: 'Priya Singh', email: 'priya.singh@example.com', role: 'Support Manager', lastLogin: '2024-07-22 09:45 AM', status: 'active' },
  { id: 'ADM003', name: 'Amit Patel', email: 'amit.patel@example.com', role: 'Finance Head', lastLogin: '2024-07-21 03:15 PM', status: 'active' },
  { id: 'ADM004', name: 'Sunita Rao', email: 'sunita.rao@example.com', role: 'Operations Lead', lastLogin: '2024-07-20 11:00 AM', status: 'suspended' },
];

const roles = ['Super Admin', 'Support Manager', 'Finance Head', 'Operations Lead'] as const;

const permissions = [
    'Users', 'Shops', 'Rentals', 'Earnings', 'Offers', 'Cancellations', 'Notifications', 'Banners', 'Settings'
];


const actionLogs = [
    { id: 'LOG001', admin: 'Priya Singh', action: 'Cancelled Rental', section: 'Rentals', timestamp: '2024-07-22 10:05 AM', ip: '192.168.1.1' },
    { id: 'LOG002', admin: 'Amit Patel', action: 'Exported Earnings Report', section: 'Earnings', timestamp: '2024-07-22 09:50 AM', ip: '10.0.0.5' },
    { id: 'LOG003', admin: 'Rohan Sharma', action: 'Suspended Admin', section: 'Admin Controls', timestamp: '2024-07-21 05:00 PM', ip: '172.16.0.1' },
];

function AdminDialog({ onSave }: { onSave: (admin: Omit<Admin, 'id' | 'lastLogin'>) => void }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Admin['role']>('Support Manager');
    const { toast } = useToast();

    const handleSave = () => {
        if (!name || !email) {
            toast({ title: "Validation Error", description: "Name and email are required.", variant: "destructive" });
            return;
        }
        onSave({ name, email, role, status: 'active' });
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Sub-Admin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Sub-Admin</DialogTitle>
                    <DialogDescription>Assign a role and invite a new member to the admin team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select onValueChange={(v: Admin['role']) => setRole(v)} defaultValue={role}>
                            <SelectTrigger id="role">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Send Invite</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminControlsPage() {
    const [admins, setAdmins] = useState(initialAdmins);
    const { toast } = useToast();

    const handleSaveAdmin = (newAdminData: Omit<Admin, 'id' | 'lastLogin'>) => {
        const newAdmin: Admin = {
            ...newAdminData,
            id: `ADM${Date.now()}`,
            lastLogin: 'Never',
        }
        setAdmins([newAdmin, ...admins]);
        toast({ title: "Admin Invited", description: `An invitation has been sent to ${newAdmin.email}.` });
    }

    const handleToggleSuspend = (adminId: string, currentStatus: 'active' | 'suspended') => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        setAdmins(admins.map(a => a.id === adminId ? { ...a, status: newStatus } : a));
        toast({ title: `Admin ${newStatus === 'active' ? 'Unsuspended' : 'Suspended'}` });
    };

    const handleDeleteAdmin = (adminId: string) => {
        setAdmins(admins.filter(a => a.id !== adminId));
        toast({ title: "Admin Deleted", variant: "destructive" });
    }

  return (
    <>
        <PageHeader title="Admin Controls" />
        <Tabs defaultValue="admins" className="space-y-6">
            <TabsList>
                <TabsTrigger value="admins">Manage Admins</TabsTrigger>
                <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                <TabsTrigger value="logs">Action Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="admins">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>
                                Manage your sub-administrators and their roles.
                            </CardDescription>
                        </div>
                        <AdminDialog onSave={handleSaveAdmin} />
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{admin.role}</TableCell>
                                        <TableCell>{admin.lastLogin}</TableCell>
                                        <TableCell>
                                            <Badge variant={admin.status === 'active' ? 'default' : 'destructive'}>{admin.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleSuspend(admin.id, admin.status)}>
                                                        <UserX className="mr-2 h-4 w-4" /> {admin.status === 'active' ? 'Suspend' : 'Unsuspend'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAdmin(admin.id)}>
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
            </TabsContent>
            <TabsContent value="roles">
                 <Card>
                    <CardHeader>
                        <CardTitle>Roles & Permissions</CardTitle>
                        <CardDescription>Define roles and manage fine-grained permissions for each section of the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                           <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permission</TableHead>
                                        {roles.map(role => <TableHead key={role} className="text-center">{role}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map(permission => (
                                        <TableRow key={permission}>
                                            <TableCell className="font-medium">{permission}</TableCell>
                                            {roles.map(role => (
                                                <TableCell key={`${permission}-${role}`} className="text-center">
                                                    <Checkbox defaultChecked={role === 'Super Admin' || (permission !== 'Admin Controls' && permission !== 'Earnings')} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="logs">
                 <Card>
                    <CardHeader>
                         <CardTitle>Admin Action Logs</CardTitle>
                        <CardDescription>An audit trail of all actions performed by administrators.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Input placeholder="Search by admin name..." className="w-64" />
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by action" />
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Logs</Button>
                        </div>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>IP Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {actionLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{log.admin}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.section}</TableCell>
                                        <TableCell>{log.timestamp}</TableCell>
                                        <TableCell>{log.ip}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </>
  );
}
