import { PageHeader } from "@/components/common/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RentalsChart } from "@/components/dashboard/rentals-chart";
import { VehicleSplitChart } from "@/components/dashboard/vehicle-split-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CancellationRatioChart } from "@/components/dashboard/cancellation-ratio-chart";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Rentals Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <RentalsChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
             <CardHeader>
              <CardTitle>Vehicle Type Split</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleSplitChart />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3">
                <CardHeader>
                <CardTitle>Cancellation Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                <CancellationRatioChart />
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
