import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appliance, monthlyKwh } from "@/hooks/useAppliances";

interface Props {
  appliances: Appliance[];
}

export default function EnergyChart({ appliances }: Props) {
  if (!appliances.length) return null;

  const data = appliances
    .map((a) => ({ name: a.name, kWh: Number(monthlyKwh(a.watts, a.hours_per_day, a.days_per_month).toFixed(2)) }))
    .sort((a, b) => b.kWh - a.kWh);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Monthly Energy by Appliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" unit=" kWh" />
              <Tooltip />
              <Bar dataKey="kWh" fill="hsl(152, 60%, 36%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
