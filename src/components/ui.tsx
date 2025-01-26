import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export const UserInterface = () => {
  return (
    <header>
      <Button
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          console.log(error);
          throw error;
        }}
      >
        log out
      </Button>
    </header>
  );
};
