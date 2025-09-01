import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, CheckCircle, FileX, Store, Users, Wallet, Hourglass } from "lucide-react"

const stats = [
    { title: "Total Shops", value: "1,250", icon: Store },
    { title: "Verified Shops", value: "1,100", icon: CheckCircle },
    { title: "Total Users", value: "15,840", icon: Users },
    { title: "Active Rentals", value: "320", icon: Hourglass },
    { title: "Completed Rentals", value: "25,480", icon: Car },
    { title: "Cancelled Rentals", value: "890", icon: FileX },
    { title: "Platform Earnings", value: "$125,430", icon: Wallet },
]

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {stats.map((stat) => (
                <Card key={stat.title}>
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
            ))}
        </div>
    )
}
