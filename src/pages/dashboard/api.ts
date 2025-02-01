import { supabase } from "@/lib/supabaseClient";

export const getRevenueCurrentWeek = () =>
  supabase.rpc("get_revenue_current_week");
export const getRevenueCurrentMonth = () =>
  supabase.rpc("get_revenue_current_month");
