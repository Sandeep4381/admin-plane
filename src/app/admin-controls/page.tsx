import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function AdminControlsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Admin Controls">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sub-Admin
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Manage Admins & Roles</CardTitle>
          <CardDescription>
            Control roles, permissions, and view action logs for all administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of sub-admins with their roles and permissions will be displayed here.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
