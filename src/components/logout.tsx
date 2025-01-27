import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  throw error;
};

export const Logout = () => <Button onClick={logout}>Logout</Button>;
