import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from 'next/image';

export default function BannersPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Banners">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Banner
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Manage Banners</CardTitle>
          <CardDescription>
            Upload and manage promotional banners and posters for the user app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
                <Image src="https://picsum.photos/600/338" alt="Banner 1" fill className="object-cover" data-ai-hint="advertisement banner" />
            </div>
             <div className="relative aspect-video overflow-hidden rounded-lg border">
                <Image src="https://picsum.photos/600/337" alt="Banner 2" fill className="object-cover" data-ai-hint="advertisement banner" />
            </div>
             <div className="relative aspect-video overflow-hidden rounded-lg border">
                <Image src="https://picsum.photos/600/336" alt="Banner 3" fill className="object-cover" data-ai-hint="advertisement banner" />
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
