import { supabase } from "@/lib/supabaseClient";

export const deleteUser = async (p_user_id: string) => {
  const { data, error } = await supabase.rpc("delete_user", { p_user_id });

  if (error) throw error;
  return data;
};

export const updateRole = async (value: string, id: string) => {
  const { error, data } = await supabase
    .from("users")
    .update({ role: value })
    .eq("id", id)
    .select("id");

  if (error) throw error;
  return data;
};
