import { Appliance, monthlyKwh } from "@/hooks/useAppliances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Props {
  appliances: Appliance[];
}

interface Tip {
  appliance: string;
  tip: string;
}

function generateTips(appliances: Appliance[]): Tip[] {
  if (!appliances.length) return [];
  const tips: Tip[] = [];
  const sorted = [...appliances].sort(
    (a, b) => monthlyKwh(b.watts, b.hours_per_day, b.days_per_month) - monthlyKwh(a.watts, a.hours_per_day, a.days_per_month)
  );

  for (const a of sorted.slice(0, 5)) {
    const mkwh = monthlyKwh(a.watts, a.hours_per_day, a.days_per_month);
    if (a.hours_per_day > 12) {
      tips.push({ appliance: a.name, tip: `Runs ${a.hours_per_day}h/day. Consider reducing usage by 2 hours to save ~${((a.watts * 2 * a.days_per_month) / 1000).toFixed(1)} kWh/month.` });
    }
    if (a.watts > 1000) {
      tips.push({ appliance: a.name, tip: `High wattage (${a.watts}W). Look for energy-efficient models or use a timer to reduce idle time.` });
    }
    if (a.days_per_month >= 28 && a.hours_per_day >= 8) {
      tips.push({ appliance: a.name, tip: `Used almost daily for ${a.hours_per_day}h. Using it on alternate days could halve consumption to ${(mkwh / 2).toFixed(1)} kWh/month.` });
    }
    if (mkwh > 100) {
      tips.push({ appliance: a.name, tip: `Consumes ${mkwh.toFixed(0)} kWh/month — your biggest energy drain. Prioritize efficiency improvements here.` });
    }
  }

  // Deduplicate by appliance+tip
  const seen = new Set<string>();
  return tips.filter((t) => {
    const key = `${t.appliance}:${t.tip}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

export default function EnergySavingTips({ appliances }: Props) {
  const tips = generateTips(appliances);
  if (!tips.length) return null;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Lightbulb className="h-5 w-5 text-accent-foreground" />
        <CardTitle className="text-lg">Energy-Saving Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((t, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-sm">{t.appliance}</p>
                <p className="text-sm text-muted-foreground">{t.tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
