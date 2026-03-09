import { Zap, LogOut } from "lucide-react";
import { useAppliances, useSettings } from "@/hooks/useAppliances";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import DashboardCards from "@/components/DashboardCards";
import AddApplianceForm from "@/components/AddApplianceForm";
import ApplianceTable from "@/components/ApplianceTable";
import EnergyChart from "@/components/EnergyChart";
import ElectricityPriceSettings from "@/components/ElectricityPriceSettings";
import EnergySavingTips from "@/components/EnergySavingTips";
import UsageTrends from "@/components/UsageTrends";

const Index = () => {
  const { data: appliances = [], isLoading: loadingAppliances } = useAppliances();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const { user, signOut } = useAuth();
  const price = settings?.electricity_price ?? 0;

  if (loadingAppliances || loadingSettings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Energy Usage Optimizer</h1>
              <p className="text-sm text-muted-foreground">Track and optimize your household electricity consumption</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <ElectricityPriceSettings />
        <DashboardCards appliances={appliances} electricityPrice={price} />
        <AddApplianceForm />
        <ApplianceTable appliances={appliances} electricityPrice={price} />
        <EnergyChart appliances={appliances} />
        <EnergySavingTips appliances={appliances} />
        <UsageTrends />
      </main>

      <footer className="border-t border-border mt-auto h-24 flex items-center justify-center text-sm text-muted-foreground">
        Built and powered by IanOtollo
      </footer>
    </div>
  );
};

export default Index;
