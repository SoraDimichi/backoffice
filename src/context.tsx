import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { supabase } from "./lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface JwtPayload {
  user_role: string;
}

interface UserContextType {
  userLoaded: boolean | null;
  user: User;
}

type User = (Session["user"] & { appRole: string | null }) | null;

const UserContext = createContext<UserContextType>({
  userLoaded: false,
  user: null,
});

export const useUser = () => useContext(UserContext);

export const WithUser = ({ children }: { children: ReactNode }) => {
  const push = useNavigate();
  const [userLoaded, setUserLoaded] = useState<boolean | null>(null);
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
          currentUser.appRole = decoded.user_role;
        }
      }

      setUser(currentUser);
      setUserLoaded(!!currentUser);
    };

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => saveSession(session));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        saveSession(session);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [push]);

  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
