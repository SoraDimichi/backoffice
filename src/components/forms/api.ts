import {
  createUserSchema,
  loginUserSchema,
  registerUserSchema,
} from "@/components/forms/schemas";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

type CreateUserP = z.infer<typeof createUserSchema>;
const createUser = async (p: CreateUserP) => {
  const { data, error } = await supabase.rpc("create_user", p);

  if (error) throw error;
  return data;
};

type LoginFormValues = z.infer<typeof loginUserSchema>;
const login = async (p: LoginFormValues) => {
  const { data, error } = await supabase.auth.signInWithPassword(p);

  if (error) throw error;
  return data;
};

type RegisterFormValues = Omit<z.infer<typeof registerUserSchema>, "terms">;
const register = async (p: RegisterFormValues) => {
  const { data, error } = await supabase.auth.signUp({
    email: p.email,
    password: p.password,
    options: {
      data: {
        first_name: p.first_name,
        last_name: p.last_name,
      },
    },
  });

  if (error) throw error;
  return data;
};

export { createUser, login, register };
