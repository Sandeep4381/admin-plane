
"use client"

import React, { useState } from 'react';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Mail, MessageSquare, Send, Calendar, Save, Copy, Download } from 'lucide-react';

const sentNotifications = [
    { id: 'N001', message: 'Get 20% off on your next ride!', audience: 'All Users', channel: 'Push', status: 'Delivered' },
    { id: 'N002', message: 'Your documents are pending verification.', audience: 'Shops (Pending)', channel: 'Email', status: 'Opened' },
    { id: 'N003', message: 'We miss you! Here\'s a special offer.', audience: 'Inactive Users', channel: 'SMS', status: 'Delivered' },
    { id: 'N004', message: 'Maintenance scheduled for tonight.', audience: 'All Shops', channel: 'Email', status: 'Failed' },
];

export default function NotificationsPage() {
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState('');

    return (
        <>
            <PageHeader title="Notifications">
                <div className="flex gap-2">
                    <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save Draft</Button>
                    <Button><Send className="mr-2 h-4 w-4" /> Send Notification</Button>
                </div>
            </PageHeader>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Compose Notification</CardTitle>
                            <CardDescription>
                                Craft your message, select channels, and target your audience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Notification Title</Label>
                                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" placeholder="E.g., Special Offer Just For You!" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Type your notification message here."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="min-h-[150px]"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Channels</Label>
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="push" defaultChecked />
                                            <Label htmlFor="push" className="font-normal flex items-center gap-2"><Smartphone /> Push Notification</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="email" />
                                            <Label htmlFor="email" className="font-normal flex items-center gap-2"><Mail /> Email</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="sms" />
                                            <Label htmlFor="sms" className="font-normal flex items-center gap-2"><MessageSquare /> SMS</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="audience">Target Audience</Label>
                                    <Select defaultValue="all">
                                        <SelectTrigger id="audience">
                                            <SelectValue placeholder="Select audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Users</SelectItem>
                                            <SelectItem value="inactive">Inactive Users</SelectItem>
                                            <SelectItem value="shops">All Shops</SelectItem>
                                            <SelectItem value="verified_users">Verified Users</SelectItem>
                                            <SelectItem value="high_cancellation">High-Cancellation Users</SelectItem>
                                            <SelectItem value="high_value">High-Value Users</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardHeader className="border-t">
                            <CardTitle className="text-lg">Scheduling</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4 pt-4">
                             <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Schedule for Later</Button>
                             <p className="text-sm text-muted-foreground">Or send immediately by clicking the main button.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Sent Notifications</CardTitle>
                            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export Logs</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Message</TableHead>
                                        <TableHead>Audience</TableHead>
                                        <TableHead>Channel</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sentNotifications.map((notif) => (
                                        <TableRow key={notif.id}>
                                            <TableCell className="font-medium truncate max-w-xs">{notif.message}</TableCell>
                                            <TableCell>{notif.audience}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{notif.channel}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={notif.status === 'Delivered' ? 'default' : notif.status === 'Opened' ? 'secondary' : 'destructive'}>
                                                    {notif.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Mobile Preview */}
                            <div>
                                <Label className="flex items-center gap-2 mb-2"><Smartphone /> Push Notification</Label>
                                <div className="bg-zinc-800 p-4 rounded-lg text-white max-w-sm mx-auto">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-white text-black text-xs font-bold rounded-sm p-1">SK</span>
                                        <p className="text-xs font-semibold">SawariKaro</p>
                                    </div>
                                    <p className="text-sm font-bold">{title || "Notification Title"}</p>
                                    <p className="text-sm">{message || "This is where your message will appear."}</p>
                                </div>
                            </div>
                            <Separator />
                            {/* Email Preview */}
                            <div>
                                <Label className="flex items-center gap-2 mb-2"><Mail /> Email</Label>
                                <div className="border rounded-lg p-4">
                                     <p className="text-sm text-muted-foreground mb-2">To: user@example.com</p>
                                     <h3 className="text-lg font-semibold border-b pb-2 mb-2">{title || "Email Subject Line"}</h3>
                                     <p className="text-sm">{message || "This is where your rich text email content will appear. You can include links, bold text, and more."}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
