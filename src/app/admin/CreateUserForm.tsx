"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { AddUser } from ".";
import { createUserSchema } from "../auth/Register";

const userSchema = z.object({
  ...createUserSchema,
  role: z.enum(["user", "admin"], { required_error: "Please select a role." }),
});

type CreateUserFormProps = React.ComponentPropsWithoutRef<"div"> & {
  addUser: AddUser;
  close: () => void;
};
type CreateUserP = z.infer<typeof userSchema>;

const createUser = async ({ email, ...p }: CreateUserP) => {
  const { data, error } = await supabase.rpc("create_user", { email, ...p });
  if (error) throw Error(error.message);

  return data;
};

const CreateUserForm = (p: CreateUserFormProps) => {
  const { className, close, addUser, ...props } = p;
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      role: "user",
    },
  });

  const { setError, formState, watch, clearErrors } = form;
  const { errors, isSubmitting, isLoading, isSubmitted } = formState;
  const disabled = isSubmitting && isLoading && isSubmitted;

  useEffect(() => {
    const subscription = watch(() => "root" in errors && clearErrors("root"));
    return () => subscription.unsubscribe();
  }, [clearErrors, errors, watch]);

  const onSubmit = async (data: z.infer<typeof userSchema>) =>
    createUser(data)
      .then((id) =>
        addUser({
          id,
          username: `${data.first_name} ${data.last_name}`,
          role: data.role,
        }),
      )
      .then(close)
      .catch((error) => setError("root", { message: error.message }));

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create User</CardTitle>
          <CardDescription>Enter user details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              noValidate
            >
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input disabled={disabled} type="text" {...field} />
                      </FormControl>
                      <FormDescription>User's given name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input disabled={disabled} type="text" {...field} />
                      </FormControl>
                      <FormDescription>User's family name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={disabled}
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>User's email.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input disabled={disabled} type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a secure password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-red-500 text-sm h-2 text-center">
                  {errors?.root?.message}
                </div>
                <Button type="submit" className="w-full" disabled={disabled}>
                  {form.formState.isLoading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

type FormButtonP = { className: string; addUser: AddUser };
export const FormButton = ({ className, addUser }: FormButtonP) => {
  const [shown, setShowForm] = useState(false);

  const close = () => setShowForm(false);

  return (
    <div>
      <Button className={className} onClick={() => setShowForm(true)}>
        Create New User
      </Button>
      {shown && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-20 flex items-center justify-center z-50">
          <div className="relative min-w-75">
            <CreateUserForm addUser={addUser} close={close} />
            <Button className="absolute absolute top-7 right-4" onClick={close}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
