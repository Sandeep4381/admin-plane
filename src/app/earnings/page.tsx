import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function EarningsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Earnings">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Details</CardTitle>
          <CardDescription>
            Detailed breakdown of platform revenue, shop earnings, and commissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Earnings charts and tables with filters for city, vehicle, and date will be displayed here.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
