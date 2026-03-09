import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings, useUpdateSettings } from "@/hooks/useAppliances";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function ElectricityPriceSettings() {
  const { data: settings } = useSettings();
  const updateMutation = useUpdateSettings();
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (settings) setPrice(String(settings.electricity_price));
  }, [settings]);

  const handleSave = () => {
    if (!settings) return;
    const val = Number(price);
    if (isNaN(val) || val < 0) {
      toast.error("Enter a valid price");
      return;
    }
    updateMutation.mutate(
      { id: settings.id, electricity_price: val },
      {
        onSuccess: () => toast.success("Price updated"),
        onError: () => toast.error("Failed to update price"),
      }
    );
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Settings className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">Electricity Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <div className="space-y-1.5 flex-1 max-w-xs">
            <Label htmlFor="price">Enter your electricity tariff per kWh in your local currency.</Label>
            <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.12" />
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
