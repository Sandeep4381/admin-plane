
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, AlertTriangle, FileText, CalendarClock } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RevenueByVehicleChart } from "@/components/earnings/revenue-by-vehicle-chart";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";


const revenueData = [
  { name: 'Jan', revenue: 4000, commission: 240 },
  { name: 'Feb', revenue: 3000, commission: 139 },
  { name: 'Mar', revenue: 5000, commission: 980 },
  { name: 'Apr', revenue: 4780, commission: 390 },
  { name: 'May', revenue: 5890, commission: 480 },
  { name: 'Jun', revenue: 4390, commission: 380 },
  { name: 'Jul', revenue: 5490, commission: 430 },
];

const transactionData = [
    { id: 'T001', date: '2024-07-20', shop: 'Deluxe Car Rentals', amount: '$150.00', commission: '$15.00' },
    { id: 'T002', date: '2024-07-20', shop: 'Speedy Bikes', amount: '$50.00', commission: '$5.00' },
    { id: 'T003', date: '2024-07-19', shop: 'Metro Auto', amount: '$250.00', commission: '$25.00' },
    { id: 'T004', date: '2024-07-19', shop: 'Deluxe Car Rentals', amount: '$80.00', commission: '$8.00' },
    { id: 'T005', date: '2024-07-18', shop: 'City Scooters', amount: '$30.00', commission: '$3.00' },
];

const shopLeaderboardData = [
    { rank: 1, name: "Deluxe Car Rentals", earnings: '$55,000' },
    { rank: 2, name: "Metro Auto", earnings: '$48,000' },
    { rank: 3, name: "Speedy Bikes", earnings: '$32,000' },
    { rank: 4, name: "City Scooters", earnings: '$25,000' },
    { rank: 5, name: "Downtown Cars", earnings: '$22,000' },
]


export default function EarningsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Earnings">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>CSV</DropdownMenuItem>
                <DropdownMenuItem>PDF</DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>
      
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,250,345</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$125,430</div>
                    <p className="text-xs text-muted-foreground">+18.3% from last month</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$85,320</div>
                    <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Shop Payouts</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,124,915</div>
                    <p className="text-xs text-muted-foreground">Pending: $50,120</p>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Revenue &amp; Commission</CardTitle>
                    <CardDescription>
                        Monthly breakdown of total revenue and platform commission.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="commission" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                        A log of the latest transactions processed on the platform.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Shop</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Commission</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionData.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">{transaction.id}</TableCell>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.shop}</TableCell>
                                        <TableCell>{transaction.amount}</TableCell>
                                        <TableCell className="text-primary">{transaction.commission}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Vehicle Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueByVehicleChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shop Leaderboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Shop Name</TableHead>
                                    <TableHead>Earnings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shopLeaderboardData.map((shop) => (
                                    <TableRow key={shop.rank}>
                                        <TableCell>{shop.rank}</TableCell>
                                        <TableCell className="font-medium">{shop.name}</TableCell>
                                        <TableCell>{shop.earnings}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Area</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-video w-full">
                           <Image src="https://picsum.photos/800/451" alt="Revenue Heatmap" fill className="object-cover rounded-md" data-ai-hint="map heatmap" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Controls &amp; Reporting</CardTitle>
                        <CardDescription>Manage exports, reports, and alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="scheduled-reports" className="flex items-center gap-2"><CalendarClock/>Scheduled Reports</Label>
                            <Button variant="outline" size="sm">Schedule</Button>
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="tax-breakdown" className="flex items-center gap-2"><FileText />Tax / GST Breakdown</Label>
                            <Button variant="outline" size="sm">View</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="payout-alerts" className="flex items-center gap-2"><AlertTriangle />Payout Alerts</Label>
                            <Switch id="payout-alerts" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
