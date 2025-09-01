import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function OffersPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Offers & Campaigns">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Offer
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Manage Offers</CardTitle>
          <CardDescription>
            Create, manage, and track promotional offers and campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of active, scheduled, and expired offers will be displayed here.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
