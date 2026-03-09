import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Appliance, useDeleteAppliance, dailyKwh, monthlyKwh, monthlyCost } from "@/hooks/useAppliances";

interface Props {
  appliances: Appliance[];
  electricityPrice: number;
}

export default function ApplianceTable({ appliances, electricityPrice }: Props) {
  const deleteMutation = useDeleteAppliance();

  if (!appliances.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
        No appliances added yet. Use the form above to add your first appliance.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-x-auto shadow-sm bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appliance</TableHead>
            <TableHead className="text-right">Watts</TableHead>
            <TableHead className="text-right">Hrs/Day</TableHead>
            <TableHead className="text-right">Days/Mo</TableHead>
            <TableHead className="text-right">Daily kWh</TableHead>
            <TableHead className="text-right">Monthly kWh</TableHead>
            <TableHead className="text-right">Monthly Cost</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliances.map((a) => {
            const dkwh = dailyKwh(a.watts, a.hours_per_day);
            const mkwh = monthlyKwh(a.watts, a.hours_per_day, a.days_per_month);
            const mc = monthlyCost(a.watts, a.hours_per_day, a.days_per_month, electricityPrice);
            return (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell className="text-right">{a.watts}</TableCell>
                <TableCell className="text-right">{a.hours_per_day}</TableCell>
                <TableCell className="text-right">{a.days_per_month}</TableCell>
                <TableCell className="text-right">{dkwh.toFixed(3)}</TableCell>
                <TableCell className="text-right">{mkwh.toFixed(2)}</TableCell>
                <TableCell className="text-right">{mc.toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(a.id)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
