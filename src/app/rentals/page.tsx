import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RentalsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Rentals" />
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
              <CardDescription>
                Live monitoring of all ongoing rentals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Active rentals table will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
           <Card>
            <CardHeader>
              <CardTitle>Completed Rentals</CardTitle>
              <CardDescription>
                History of all completed rentals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Completed rentals table will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cancelled">
           <Card>
            <CardHeader>
              <CardTitle>Cancelled Rentals</CardTitle>
              <CardDescription>
                Details of all cancelled rentals with reasons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Cancelled rentals table will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
