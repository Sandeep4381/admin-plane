import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Notifications" />
      <Card>
        <CardHeader>
          <CardTitle>Send a Notification</CardTitle>
          <CardDescription>
            Compose and send notifications via Push, Email, or SMS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Type your notification message here." />
            </div>
            <div className="space-y-2">
                <Label>Target Audience</Label>
                <RadioGroup defaultValue="all" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="r1" />
                        <Label htmlFor="r1">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inactive" id="r2" />
                        <Label htmlFor="r2">Inactive Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shops" id="r3" />
                        <Label htmlFor="r3">Shops</Label>
                    </div>
                </RadioGroup>
            </div>
            <Button>Send Notification</Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
