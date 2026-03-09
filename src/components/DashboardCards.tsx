import { Zap, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appliance, dailyKwh, monthlyKwh, monthlyCost } from "@/hooks/useAppliances";

interface Props {
  appliances: Appliance[];
  electricityPrice: number;
}

export default function DashboardCards({ appliances, electricityPrice }: Props) {
  const totalDaily = appliances.reduce((s, a) => s + dailyKwh(a.watts, a.hours_per_day), 0);
  const totalMonthly = appliances.reduce((s, a) => s + monthlyKwh(a.watts, a.hours_per_day, a.days_per_month), 0);
  const totalCost = appliances.reduce((s, a) => s + monthlyCost(a.watts, a.hours_per_day, a.days_per_month, electricityPrice), 0);
  const highest = appliances.length
    ? appliances.reduce((max, a) =>
        monthlyKwh(a.watts, a.hours_per_day, a.days_per_month) > monthlyKwh(max.watts, max.hours_per_day, max.days_per_month) ? a : max
      )
    : null;

  const cards = [
    { title: "Daily Usage", value: `${totalDaily.toFixed(2)} kWh`, icon: Zap, color: "text-primary" },
    { title: "Monthly Usage", value: `${totalMonthly.toFixed(2)} kWh`, icon: TrendingUp, color: "text-accent-foreground" },
    { title: "Monthly Cost", value: `${totalCost.toFixed(2)}`, icon: DollarSign, color: "text-destructive" },
    { title: "Highest Consumer", value: highest?.name ?? "—", icon: AlertTriangle, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.title} className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            <c.icon className={`h-4 w-4 ${c.color}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">{appliances.length ? c.value : "—"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
