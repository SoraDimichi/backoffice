import { supabase } from "@/lib/supabaseClient";
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
