import { AuthForm } from "./components/form";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { UserInterface } from "./components/ui";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session ? (
    <UserInterface />
  ) : (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}

export default App;
