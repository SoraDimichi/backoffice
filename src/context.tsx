import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { supabase } from "./lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface JwtPayload {
  user_role: string;
}

interface UserContextType {
  userLoaded: boolean;
  user: User;
  signOut: () => Promise<void>;
}

type User = (Session["user"] & { appRole: string | null }) | null;

const UserContext = createContext<UserContextType>({
  userLoaded: false,
  user: null,
  signOut: async () => {},
});

export const useUser = () => useContext(UserContext);

export const WithUser = ({ children }: { children: ReactNode }) => {
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [, setSession] = useState<Session | null>(null);

  useLayoutEffect(() => {
    const saveSession = (session: Session | null) => {
      setSession(session);

      const currentUser: User = session?.user
        ? { ...session.user, appRole: null }
        : null;
      if (session && session.access_token) {
        const decoded = jwtDecode<JwtPayload>(session.access_token);
        if (currentUser) {
          console.log("decoded", decoded.user_role);
          currentUser.appRole = decoded.user_role;
        }
      }

      setUser(currentUser);
      setUserLoaded(!!currentUser);
      // if (currentUser) {
      //   router.push("/channels/[id]", "/channels/1");
      // }
    };

    // Fetch the initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => saveSession(session));

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        saveSession(session);
      },
    );

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    // if (!error) {
    //   router.push("/");
    // } else {
    //   console.error("Error signing out:", error);
    // }
  };

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
