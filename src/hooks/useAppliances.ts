import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hours_per_day: number;
  days_per_month: number;
  user_id: string;
  created_at: string;
}

export interface NewAppliance {
  name: string;
  watts: number;
  hours_per_day: number;
  days_per_month: number;
}

export function useAppliances() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["appliances", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appliances")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Appliance[];
    },
    enabled: !!user,
  });
}

export function useAddAppliance() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (appliance: NewAppliance) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("appliances").insert({ ...appliance, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appliances"] }),
  });
}

export function useDeleteAppliance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appliances").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appliances"] }),
  });
}

export function useSettings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["settings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        // Create default settings for this user
        const { data: newSettings, error: insertError } = await supabase
          .from("settings")
          .insert({ electricity_price: 0, user_id: user.id })
          .select()
          .single();
        if (insertError) throw insertError;
        return newSettings as { id: string; electricity_price: number; user_id: string };
      }
      return data as { id: string; electricity_price: number; user_id: string };
    },
    enabled: !!user,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, electricity_price }: { id: string; electricity_price: number }) => {
      const { error } = await supabase
        .from("settings")
        .update({ electricity_price })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useUsageHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["usage_history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usage_history")
        .select("*")
        .order("month_year", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useSaveUsageSnapshot() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ monthYear, totalKwh, totalCost }: { monthYear: string; totalKwh: number; totalCost: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("usage_history")
        .upsert(
          { user_id: user.id, month_year: monthYear, total_monthly_kwh: totalKwh, total_monthly_cost: totalCost },
          { onConflict: "user_id,month_year" }
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usage_history"] }),
  });
}

// Calculation helpers
export function dailyKwh(watts: number, hoursPerDay: number) {
  return (watts * hoursPerDay) / 1000;
}

export function monthlyKwh(watts: number, hoursPerDay: number, daysPerMonth: number) {
  return dailyKwh(watts, hoursPerDay) * daysPerMonth;
}

export function monthlyCost(watts: number, hoursPerDay: number, daysPerMonth: number, price: number) {
  return monthlyKwh(watts, hoursPerDay, daysPerMonth) * price;
}
