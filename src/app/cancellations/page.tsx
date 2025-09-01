import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { CancellationForm } from "./cancellation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CancellationsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Cancellations" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle>Analyze Cancellation Reasons</CardTitle>
                <CardDescription>
                    Use AI to identify key themes from cancellation reasons. Paste a list of reasons below, one per line.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CancellationForm />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
                <CardTitle>Cancellation Statistics</CardTitle>
                <CardDescription>
                    Breakdown of cancellations by various factors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Charts and stats about cancellations by User, Shop, Area will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
