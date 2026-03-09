import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsageHistory, useSaveUsageSnapshot, useAppliances, useSettings, monthlyKwh, monthlyCost } from "@/hooks/useAppliances";
import { toast } from "sonner";
import { TrendingUp, Save } from "lucide-react";

export default function UsageTrends() {
  const { data: history = [] } = useUsageHistory();
  const { data: appliances = [] } = useAppliances();
  const { data: settings } = useSettings();
  const saveMutation = useSaveUsageSnapshot();
  const price = settings?.electricity_price ?? 0;

  const handleSaveSnapshot = () => {
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const totalKwh = appliances.reduce((s, a) => s + monthlyKwh(a.watts, a.hours_per_day, a.days_per_month), 0);
    const totalCostVal = appliances.reduce((s, a) => s + monthlyCost(a.watts, a.hours_per_day, a.days_per_month, price), 0);

    saveMutation.mutate(
      { monthYear, totalKwh, totalCost: totalCostVal },
      {
        onSuccess: () => toast.success("Snapshot saved for " + monthYear),
        onError: () => toast.error("Failed to save snapshot"),
      }
    );
  };

  const chartData = history.map((h) => ({
    month: h.month_year,
    kWh: Number(h.total_monthly_kwh),
    cost: Number(h.total_monthly_cost),
  }));

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">Usage Trends</CardTitle>
            <CardDescription>Track your energy consumption over time</CardDescription>
          </div>
        </div>
        <Button onClick={handleSaveSnapshot} disabled={saveMutation.isPending || !appliances.length} size="sm" variant="outline" className="gap-2">
          <Save className="h-4 w-4" /> Save This Month
        </Button>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No usage history yet. Click "Save This Month" to record your current usage and start tracking trends.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="kWh" stroke="hsl(152, 60%, 36%)" strokeWidth={2} dot={{ r: 4 }} name="Monthly kWh" />
                <Line type="monotone" dataKey="cost" stroke="hsl(199, 60%, 49%)" strokeWidth={2} dot={{ r: 4 }} name="Monthly Cost" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
