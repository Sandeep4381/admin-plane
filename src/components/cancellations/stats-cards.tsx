import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX, Percent, TrendingDown, TrendingUp } from "lucide-react"

const stats = [
    { title: "Total Cancellations", value: "890", icon: FileX, href: "/rentals?tab=cancelled" },
    { title: "Cancellation Rate", value: "5.8%", icon: Percent, href: "/cancellations" },
    { title: "Top Reason", value: "Vehicle Unavailable", icon: TrendingDown, href: "/cancellations" },
    { title: "High-Cancel Shops", value: "Deluxe Car Rentals", icon: TrendingUp, href: "/shops" },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Link href={stat.href} key={stat.title}>
                    <Card className="hover:bg-muted transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
