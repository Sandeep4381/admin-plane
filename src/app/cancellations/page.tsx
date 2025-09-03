import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { CancellationForm } from "./cancellation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CancellationRatioChart } from "@/components/dashboard/cancellation-ratio-chart";

export default function CancellationsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Cancellations" />
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
                <CardTitle>Cancellation Statistics</CardTitle>
                <CardDescription>
                    A visual breakdown of cancellation reasons.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <CancellationRatioChart />
               <p className="text-center text-sm text-muted-foreground mt-2">Breakdown by reason</p>
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
                <p>A table of shops ranked by cancellations will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
