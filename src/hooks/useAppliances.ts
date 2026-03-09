import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hours_per_day: number;
  days_per_month: number;
  created_at: string;
}

export interface NewAppliance {
  name: string;
  watts: number;
  hours_per_day: number;
  days_per_month: number;
}

export function useAppliances() {
  return useQuery({
    queryKey: ["appliances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appliances")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Appliance[];
    },
  });
}

export function useAddAppliance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appliance: NewAppliance) => {
      const { error } = await supabase.from("appliances").insert(appliance);
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
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as { id: string; electricity_price: number };
    },
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
