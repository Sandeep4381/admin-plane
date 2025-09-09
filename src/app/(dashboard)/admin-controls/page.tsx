

"use client";

import React, { useState } from 'react';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Trash2, Edit, UserX, Download, Search, ShieldCheck, ArrowLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';


type Admin = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Manager' | 'Finance Head' | 'Operations Lead' | 'Analyzer' | 'Project Management' | 'Research Assistant';
  lastLogin: string;
  status: 'active' | 'suspended';
};

const initialAdmins: Admin[] = [
  { id: 'ADM001', name: 'Rohan Sharma', email: 'rohan.sharma@example.com', role: 'Super Admin', lastLogin: '2024-07-22 10:00 AM', status: 'active' },
  { id: 'ADM002', name: 'Priya Singh', email: 'priya.singh@example.com', role: 'Support Manager', lastLogin: '2024-07-22 09:45 AM', status: 'active' },
  { id: 'ADM003', name: 'Amit Patel', email: 'amit.patel@example.com', role: 'Finance Head', lastLogin: '2024-07-21 03:15 PM', status: 'active' },
  { id: 'ADM004', name: 'Sunita Rao', email: 'sunita.rao@example.com', role: 'Operations Lead', lastLogin: '2024-07-20 11:00 AM', status: 'suspended' },
  { id: 'ADM005', name: 'Rahul Kumar', email: 'rahul@gmail.com', role: 'Finance Head', lastLogin: 'Never', status: 'active' },
];

const initialRoles = [
  { id: 20, name: 'Super Admin', description: 'Full access to all dashboard features.', status: 'active', fullAccess: true },
  { id: 76, name: 'Research Assistant', description: 'Manages users, rentals, and notifications.', status: 'active', fullAccess: false },
  { id: 77, name: 'Project Management', description: 'Access to earnings, payouts, and financial reports.', status: 'active', fullAccess: false },
  { id: 78, name: 'Analyzer', description: 'Manages shops, cancellations, and banners.', status: 'active', fullAccess: false },
  { name: 'Support Manager', id: 79, description: 'Manages users, rentals, and notifications.', status: 'active', fullAccess: false },
  { name: 'Finance Head', id: 80, description: 'Access to earnings, payouts, and financial reports.', status: 'active', fullAccess: false },
  { name: 'Operations Lead', id: 81, description: 'Manages shops, cancellations, and banners.', status: 'active', fullAccess: false },
] as const;

type Role = (typeof initialRoles)[number];

type Permission = {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}
type RolePermissions = Record<string, Permission>;

const permissionsConfig: Record<Role['name'], RolePermissions> = {
    'Super Admin': {
        Dashboard: { view: true, create: true, edit: true, delete: true },
        Users: { view: true, create: true, edit: true, delete: true },
        Shops: { view: true, create: true, edit: true, delete: true },
        Rentals: { view: true, create: true, edit: true, delete: true },
        Earnings: { view: true, create: true, edit: true, delete: true },
        Offers: { view: true, create: true, edit: true, delete: true },
        Cancellations: { view: true, create: true, edit: true, delete: true },
        Notifications: { view: true, create: true, edit: true, delete: true },
        Banners: { view: true, create: true, edit: true, delete: true },
        'Admin Controls': { view: true, create: true, edit: true, delete: true },
    },
    'Support Manager': {
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: true, create: true, edit: true, delete: false },
        Shops: { view: true, create: false, edit: true, delete: false },
        Rentals: { view: true, create: false, edit: true, delete: false },
        Earnings: { view: false, create: false, edit: false, delete: false },
        Offers: { view: true, create: false, edit: false, delete: false },
        Cancellations: { view: true, create: false, edit: true, delete: false },
        Notifications: { view: true, create: true, edit: true, delete: false },
        Banners: { view: false, create: false, edit: false, delete: false },
        'Admin Controls': { view: false, create: false, edit: false, delete: false },
    },
    'Finance Head': {
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: true, create: false, edit: false, delete: false },
        Shops: { view: true, create: false, edit: false, delete: false },
        Rentals: { view: true, create: false, edit: false, delete: false },
        Earnings: { view: true, create: true, edit: true, delete: false },
        Offers: { view: true, create: true, edit: true, delete: false },
        Cancellations: { view: true, create: false, edit: false, delete: false },
        Notifications: { view: false, create: false, edit: false, delete: false },
        Banners: { view: false, create: false, edit: false, delete: false },
        'Admin Controls': { view: false, create: false, edit: false, delete: false },
    },
    'Operations Lead': {
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: false, create: false, edit: false, delete: false },
        Shops: { view: true, create: true, edit: true, delete: true },
        Rentals: { view: true, create: false, edit: true, delete: true },
        Earnings: { view: false, create: false, edit: false, delete: false },
        Offers: { view: true, create: true, edit: false, delete: false },
        Cancellations: { view: true, create: false, edit: false, delete: false },
        Notifications: { view: true, create: true, edit: false, delete: false },
        Banners: { view: true, create: true, edit: true, delete: true },
        'Admin Controls': { view: false, create: false, edit: false, delete: false },
    },
    'Analyzer': { 
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: true, create: false, edit: false, delete: false }, 
        Shops: { view: true, create: false, edit: false, delete: false }, 
        Rentals: { view: true, create: false, edit: false, delete: false }, 
        Earnings: { view: true, create: false, edit: false, delete: false }, 
        Offers: { view: true, create: false, edit: false, delete: false }, 
        Cancellations: { view: true, create: false, edit: false, delete: false }, 
        Notifications: { view: false, create: false, edit: false, delete: false }, 
        Banners: { view: false, create: false, edit: false, delete: false },
        'Admin Controls': { view: false, create: false, edit: false, delete: false }
    },
    'Project Management': { 
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: true, create: false, edit: false, delete: false }, 
        Shops: { view: true, create: false, edit: false, delete: false }, 
        Rentals: { view: true, create: false, edit: false, delete: false }, 
        Earnings: { view: true, create: false, edit: false, delete: false }, 
        Offers: { view: true, create: false, edit: false, delete: false }, 
        Cancellations: { view: true, create: false, edit: false, delete: false }, 
        Notifications: { view: false, create:false, edit: false, delete: false }, 
        Banners: { view: false, create: false, edit: false, delete: false },
        'Admin Controls': { view: false, create: false, edit: false, delete: false }
    },
    'Research Assistant': { 
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Users: { view: true, create: false, edit: false, delete: false }, 
        Shops: { view: true, create: false, edit: false, delete: false }, 
        Rentals: { view: true, create: false, edit: false, delete: false }, 
        Earnings: { view: true, create: false, edit: false, delete: false }, 
        Offers: { view: true, create: false, edit: false, delete: false }, 
        Cancellations: { view: true, create: false, edit: false, delete: false }, 
        Notifications: { view: false, create: false, edit: false, delete: false }, 
        Banners: { view: false, create: false, edit: false, delete: false },
        'Admin Controls': { view: false, create: false, edit: false, delete: false }
    },
};


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
                                {initialRoles.map(r => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}
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

function RoleEditor({ onSave, onBack, roleToEdit }: { onSave: (role: any) => void; onBack: () => void; roleToEdit?: Role | null }) {
    const [roleName, setRoleName] = useState(roleToEdit?.name || '');
    const [roleDescription, setRoleDescription] = useState(roleToEdit?.description || '');
    const [permissions, setPermissions] = useState<RolePermissions>(roleToEdit ? permissionsConfig[roleToEdit.name] : {});
    const { toast } = useToast();
    
    const permissionModules = ['Dashboard', 'Users', 'Shops', 'Rentals', 'Earnings', 'Offers', 'Cancellations', 'Notifications', 'Banners', 'Admin Controls'];
    const permissionTypes = ['view', 'create', 'edit', 'delete'] as const;

    const handlePermissionChange = (module: string, type: 'view' | 'create' | 'edit' | 'delete', checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [type]: checked,
            }
        }));
    };

    const handleSave = () => {
        if (!roleName) {
            toast({ title: "Validation Error", description: "Role name is required.", variant: "destructive" });
            return;
        }
        onSave({ name: roleName, description: roleDescription, permissions });
        onBack();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Button variant="outline" size="icon" onClick={onBack}>
                        <ArrowLeft />
                    </Button>
                    <div>
                        <CardTitle>{roleToEdit ? `Edit Role: ${roleToEdit.name}` : 'Create New Role'}</CardTitle>
                        <CardDescription>Define the role name, description, and permissions.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input id="role-name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role-description">Description</Label>
                            <Textarea id="role-description" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} rows={5} />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg">Permissions Matrix</h3>
                        <div className="border rounded-lg overflow-x-auto">
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Module</TableHead>
                                        {permissionTypes.map(p => <TableHead key={p} className="capitalize text-center">{p}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissionModules.map(module => (
                                        <TableRow key={module}>
                                            <TableCell className="font-medium">{module}</TableCell>
                                            {permissionTypes.map(type => (
                                                <TableCell key={type} className="text-center">
                                                    <Checkbox
                                                        checked={permissions[module]?.[type] || false}
                                                        onCheckedChange={(checked) => handlePermissionChange(module, type, !!checked)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Role</Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminControlsPage() {
    const [admins, setAdmins] = useState(initialAdmins);
    const [roles, setRoles] = useState(initialRoles);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isEditingOrCreatingRole, setIsEditingOrCreatingRole] = useState(false);
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

    const handleSaveRole = (role: any) => {
        toast({ title: "Role Saved", description: `Permissions for ${role.name} have been updated.` });
        // In a real app, you would also update the roles and permissionsConfig state
    };
    
    const handleEditRole = (role: Role) => {
        setEditingRole(role);
        setIsEditingOrCreatingRole(true);
    }
    
    const handleCreateRole = () => {
        setEditingRole(null);
        setIsEditingOrCreatingRole(true);
    }

    const handleBackToList = () => {
        setIsEditingOrCreatingRole(false);
        setEditingRole(null);
    }


  return (
    <>
        <PageHeader title="Admin Controls" />
        <Tabs defaultValue="admins" className="space-y-6">
            <TabsList>
                <TabsTrigger value="admins">Manage Admins</TabsTrigger>
                <TabsTrigger value="roles">Roles &amp; Permissions</TabsTrigger>
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
                 {isEditingOrCreatingRole ? (
                     <RoleEditor onSave={handleSaveRole} onBack={handleBackToList} roleToEdit={editingRole} />
                 ) : (
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Roles &amp; Permissions</CardTitle>
                                <CardDescription>Define roles and manage fine-grained permissions for each section of the dashboard.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search roles..." className="pl-8" />
                                </div>
                                <Button onClick={handleCreateRole}><PlusCircle className="mr-2 h-4 w-4" /> Create Role</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Full Access</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map(role => (
                                        <TableRow key={role.id}>
                                            <TableCell>{role.id}</TableCell>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={role.fullAccess ? 'default' : 'secondary'}>
                                                    {role.fullAccess ? 'Yes' : 'No'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                 <Badge variant={role.status === 'active' ? 'default' : 'destructive'}>
                                                    {role.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                     <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}><Edit className="h-4 w-4" /></Button>
                                                     <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                     <Switch checked={role.status === 'active'} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                 )}
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


    
