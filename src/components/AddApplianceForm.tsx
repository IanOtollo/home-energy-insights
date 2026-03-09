import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddAppliance } from "@/hooks/useAppliances";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AddApplianceForm() {
  const [name, setName] = useState("");
  const [watts, setWatts] = useState("");
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("");
  const addMutation = useAddAppliance();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !watts || !hours || !days) {
      toast.error("Please fill in all fields");
      return;
    }
    addMutation.mutate(
      { name: name.trim(), watts: Number(watts), hours_per_day: Number(hours), days_per_month: Number(days) },
      {
        onSuccess: () => {
          setName(""); setWatts(""); setHours(""); setDays("");
          toast.success("Appliance added");
        },
        onError: () => toast.error("Failed to add appliance"),
      }
    );
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Add Appliance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="name">Appliance Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Air Conditioner" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="watts">Power (Watts)</Label>
            <Input id="watts" type="number" min="0" value={watts} onChange={(e) => setWatts(e.target.value)} placeholder="1500" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hours">Hours / Day</Label>
            <Input id="hours" type="number" min="0" max="24" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="8" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="days">Days / Month</Label>
            <Input id="days" type="number" min="0" max="31" value={days} onChange={(e) => setDays(e.target.value)} placeholder="30" />
          </div>
          <Button type="submit" disabled={addMutation.isPending} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
