import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { CancellationForm } from "./cancellation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CancellationRatioChart } from "@/components/dashboard/cancellation-ratio-chart";
import { StatsCards } from "@/components/cancellations/stats-cards";
import { CancellationsByUserTypeChart } from "@/components/cancellations/cancellations-by-user-type-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const highCancelShops = [
    { name: "Deluxe Car Rentals", cancellations: 45, reason: "Vehicle Unavailable" },
    { name: "City Scooters", cancellations: 32, reason: "Customer No-Show" },
    { name: "Metro Auto", cancellations: 28, reason: "Changed Plans" },
    { name: "Speedy Bikes", cancellations: 15, reason: "Better Price" },
]

export default function CancellationsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Cancellations" />
      <div className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Analyze Cancellation Reasons</CardTitle>
                  <CardDescription>
                      Use AI to identify key themes and get actionable suggestions from your cancellation data. Paste a list of reasons below, one per line.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <CancellationForm />
              </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                  <CardTitle>Cancellation Breakdown by Reason</CardTitle>
                  <CardDescription>
                      A visual breakdown of cancellation reasons.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <CancellationRatioChart />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cancellations by User Type</CardTitle>
                    <CardDescription>A breakdown of cancellations by user segment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CancellationsByUserTypeChart />
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                  <CardTitle>Shops with High Cancellations</CardTitle>
                  <CardDescription>
                      These shops have the highest cancellation rates.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shop Name</TableHead>
                            <TableHead>Cancellations</TableHead>
                            <TableHead>Top Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {highCancelShops.map((shop) => (
                            <TableRow key={shop.name}>
                                <TableCell className="font-medium">{shop.name}</TableCell>
                                <TableCell>{shop.cancellations}</TableCell>
                                <TableCell><Badge variant="secondary">{shop.reason}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Cancellations by Area (Heatmap)</CardTitle>
                    <CardDescription>A heatmap showing cancellation hotspots.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative aspect-video w-full">
                        <Image src="https://picsum.photos/800/450" alt="Heatmap" fill className="object-cover rounded-md" data-ai-hint="map heatmap" />
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
