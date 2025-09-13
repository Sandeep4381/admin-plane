
"use client";

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, Reply, Send, UserCheck, CheckCircle, Circle, MoreHorizontal } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Pagination } from '@/components/common/pagination';


type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type TicketPriority = 'High' | 'Medium' | 'Low';
type ConversationPart = {
    author: string;
    message: string;
    timestamp: string;
    avatar: string;
};

type Ticket = {
  id: string;
  subject: string;
  user: string;
  shop: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastReply: string;
  assignedTo: string;
  conversation: ConversationPart[];
};

const initialTickets: Ticket[] = [
  { 
    id: 'TKT001', 
    subject: 'Issue with payment transaction', 
    user: 'Alice Johnson', 
    shop: 'Deluxe Car Rentals', 
    status: 'Open', 
    priority: 'High', 
    createdAt: '2024-07-22 10:00 AM',
    lastReply: '2024-07-22 10:05 AM',
    assignedTo: 'Priya Singh',
    conversation: [
        { author: 'Alice Johnson', message: 'My payment failed but the amount was debited from my account.', timestamp: '2024-07-22 10:00 AM', avatar: 'https://picsum.photos/id/1005/40/40' },
        { author: 'Support Bot', message: 'We have received your query and an agent will get back to you shortly.', timestamp: '2024-07-22 10:01 AM', avatar: 'https://picsum.photos/id/1/40/40' },
    ]
  },
  { 
    id: 'TKT002', 
    subject: 'Vehicle was not clean', 
    user: 'Bob Williams', 
    shop: 'Speedy Bikes', 
    status: 'In Progress', 
    priority: 'Medium', 
    createdAt: '2024-07-21 03:15 PM',
    lastReply: '2024-07-22 09:45 AM',
    assignedTo: 'Rohan Sharma',
    conversation: [
        { author: 'Bob Williams', message: 'The bike I rented was very dirty and not as shown in the picture.', timestamp: '2024-07-21 03:15 PM', avatar: 'https://picsum.photos/id/1006/40/40' },
        { author: 'Priya Singh', message: 'We sincerely apologize for the inconvenience. We are looking into this with the shop owner.', timestamp: '2024-07-22 09:45 AM', avatar: 'https://picsum.photos/id/1025/40/40' },
    ]
  },
  { 
    id: 'TKT003', 
    subject: 'How to upload documents?', 
    user: 'New Shop Owner', 
    shop: null, 
    status: 'Resolved', 
    priority: 'Low', 
    createdAt: '2024-07-20 11:00 AM',
    lastReply: '2024-07-20 11:15 AM',
    assignedTo: 'Amit Patel',
    conversation: [
        { author: 'New Shop Owner', message: 'I am trying to register as a new shop but cannot find where to upload my documents.', timestamp: '2024-07-20 11:00 AM', avatar: 'https://picsum.photos/id/10/40/40' },
        { author: 'Amit Patel', message: 'Hello! You can find the document upload section in your Shop Profile, under the "Verification" tab.', timestamp: '2024-07-20 11:15 AM', avatar: 'https://picsum.photos/id/102/40/40' },
    ]
  },
  { 
    id: 'TKT004', 
    subject: 'App crashing on startup', 
    user: 'Diana Miller', 
    shop: null, 
    status: 'Open', 
    priority: 'High', 
    createdAt: '2024-07-23 09:00 AM',
    lastReply: '2024-07-23 09:02 AM',
    assignedTo: 'Unassigned',
    conversation: [
        { author: 'Diana Miller', message: 'The app keeps crashing every time I open it on my new phone.', timestamp: '2024-07-23 09:00 AM', avatar: 'https://picsum.photos/id/1011/40/40' },
    ]
  },
  { 
    id: 'TKT005', 
    subject: 'Refund not processed', 
    user: 'Ethan Davis', 
    shop: 'Metro Auto', 
    status: 'In Progress', 
    priority: 'Medium', 
    createdAt: '2024-07-22 05:00 PM',
    lastReply: '2024-07-23 10:15 AM',
    assignedTo: 'Priya Singh',
    conversation: [
        { author: 'Ethan Davis', message: 'I cancelled my booking a week ago but still haven\'t received my refund.', timestamp: '2024-07-22 05:00 PM', avatar: 'https://picsum.photos/id/1012/40/40' },
        { author: 'Priya Singh', message: 'Checking on this for you right away. I see the refund was initiated. I will follow up with our payment gateway.', timestamp: '2024-07-23 10:15 AM', avatar: 'https://picsum.photos/id/1025/40/40' },
    ]
  },
   {
    id: 'TKT006',
    subject: 'Unable to change profile picture',
    user: 'Fiona Green',
    shop: null,
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2024-07-19 02:30 PM',
    lastReply: '2024-07-19 02:45 PM',
    assignedTo: 'Amit Patel',
    conversation: [
      { author: 'Fiona Green', message: 'I can\'t seem to update my profile picture.', timestamp: '2024-07-19 02:30 PM', avatar: 'https://picsum.photos/id/1013/40/40' },
      { author: 'Amit Patel', message: 'Hi Fiona, please make sure the image is in JPG or PNG format and less than 2MB. Let me know if you still face issues.', timestamp: '2024-07-19 02:45 PM', avatar: 'https://picsum.photos/id/102/40/40' },
    ]
  },
  {
    id: 'TKT007',
    subject: 'Safety concern with a vehicle',
    user: 'George White',
    shop: 'Speedy Bikes',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-07-23 11:00 AM',
    lastReply: '2024-07-23 11:05 AM',
    assignedTo: 'Rohan Sharma',
    conversation: [
      { author: 'George White', message: 'The brakes on the bike I rented felt very loose and unsafe.', timestamp: '2024-07-23 11:00 AM', avatar: 'https://picsum.photos/id/1014/40/40' },
    ]
  },
  {
    id: 'TKT008',
    subject: 'Question about monthly subscription',
    user: 'Hannah Black',
    shop: null,
    status: 'Closed',
    priority: 'Low',
    createdAt: '2024-07-18 01:00 PM',
    lastReply: '2024-07-18 01:20 PM',
    assignedTo: 'Sunita Rao',
    conversation: [
       { author: 'Hannah Black', message: 'Do you offer any monthly subscription plans?', timestamp: '2024-07-18 01:00 PM', avatar: 'https://picsum.photos/id/1015/40/40' },
       { author: 'Sunita Rao', message: 'Hi Hannah, we do! You can find all details under the "Subscriptions" section in the app menu.', timestamp: '2024-07-18 01:20 PM', avatar: 'https://picsum.photos/id/103/40/40' },
    ]
  },
];

const teamMembers = ['Priya Singh', 'Rohan Sharma', 'Amit Patel', 'Sunita Rao', 'Rahul Kumar'];


function ViewTicketDialog({ ticket, onOpenChange }: { ticket: Ticket | null; onOpenChange: (open: boolean) => void }) {
    if (!ticket) return null;

    return (
        <Dialog open={!!ticket} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{ticket.subject} (ID: {ticket.id})</DialogTitle>
                    <DialogDescription>
                        Conversation with {ticket.user}. Assigned to: {ticket.assignedTo}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-muted/50 rounded-md">
                    {ticket.conversation.map((part, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={part.avatar} alt={part.author} />
                                <AvatarFallback>{part.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-background p-3 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm">{part.author}</p>
                                    <p className="text-xs text-muted-foreground">{part.timestamp}</p>
                                </div>
                                <p className="text-sm">{part.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator />
                <div className="p-4 space-y-4">
                     <Textarea placeholder="Type your reply here..." className="min-h-[100px]" />
                     <div className="flex justify-end">
                        <Button><Send className="mr-2 h-4 w-4" /> Send Reply</Button>
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function SupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || '1';
    const tab = searchParams.get('tab') || 'open';
    
    const priorityVariant: Record<TicketPriority, 'destructive' | 'default' | 'secondary'> = {
        High: 'destructive',
        Medium: 'default',
        Low: 'secondary'
    };
    
    const statusVariant: Record<TicketStatus, 'destructive' | 'default' | 'secondary' | 'outline'> = {
        Open: 'destructive',
        'In Progress': 'default',
        Resolved: 'secondary',
        Closed: 'outline'
    };
    
    const handleAssignTicket = (ticketId: string, agent: string) => {
        setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, assignedTo: agent } : t));
        toast({ title: 'Ticket Assigned', description: `Ticket ${ticketId} has been assigned to ${agent}.` });
    };

    const handleCloseTicket = (ticketId: string) => {
        setTickets(currentTickets => currentTickets.map(t => t.id === ticketId ? { ...t, status: 'Closed' } : t));
        toast({ title: 'Ticket Closed', description: `Ticket ${ticketId} has been closed.` });
    };

    const filteredTickets = useMemo(() => {
        let results = tickets;
        const currentTab = tab as TicketStatus | 'all';
        if (currentTab !== 'all') {
            results = tickets.filter(ticket => ticket.status.toLowerCase().replace(' ', '_') === currentTab);
        }
        return results;
    }, [tickets, tab]);

    const currentPage = parseInt(page, 10);
    const itemsPerPage = 10;
    const paginatedTickets = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTickets, currentPage]);


    return (
        <>
            <PageHeader title="Support & Tickets">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tickets..." className="pl-8" />
                </div>
            </PageHeader>
            <Tabs defaultValue={tab} onValueChange={(value) => router.push(`${pathname}?tab=${value}&page=1`)}>
                <TabsList>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Ticket Queue</CardTitle>
                        <CardDescription>Manage and respond to user and shop support tickets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TicketsTable tickets={paginatedTickets} setViewingTicket={setViewingTicket} priorityVariant={priorityVariant} statusVariant={statusVariant} onAssign={handleAssignTicket} onClose={handleCloseTicket} />
                        <Pagination 
                            currentPage={currentPage}
                            totalCount={filteredTickets.length}
                            pageSize={itemsPerPage}
                            path={pathname}
                        />
                    </CardContent>
                </Card>
            </Tabs>
             <ViewTicketDialog
                ticket={viewingTicket}
                onOpenChange={(open) => !open && setViewingTicket(null)}
            />
        </>
    );
}


function TicketsTable({ tickets, setViewingTicket, priorityVariant, statusVariant, onAssign, onClose }: { 
    tickets: Ticket[],
    setViewingTicket: (ticket: Ticket) => void,
    priorityVariant: Record<TicketPriority, 'destructive' | 'default' | 'secondary'>,
    statusVariant: Record<TicketStatus, 'destructive' | 'default' | 'secondary' | 'outline'>
    onAssign: (ticketId: string, agent: string) => void;
    onClose: (ticketId: string) => void;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{ticket.user}</TableCell>
                        <TableCell>{ticket.shop || 'N/A'}</TableCell>
                        <TableCell><Badge variant={statusVariant[ticket.status]}>{ticket.status}</Badge></TableCell>
                        <TableCell><Badge variant={priorityVariant[ticket.priority]}>{ticket.priority}</Badge></TableCell>
                        <TableCell>{ticket.lastReply}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setViewingTicket(ticket)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <UserCheck className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Assign Agent</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {teamMembers.map(agent => (
                                            <DropdownMenuItem key={agent} onSelect={() => onAssign(ticket.id, agent)}>
                                                {agent === ticket.assignedTo ? (
                                                    <Circle className="mr-2 h-4 w-4 fill-foreground" />
                                                ) : (
                                                    <Circle className="mr-2 h-4 w-4" />
                                                )}
                                                {agent}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button variant="ghost" size="icon" onClick={() => onClose(ticket.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

    