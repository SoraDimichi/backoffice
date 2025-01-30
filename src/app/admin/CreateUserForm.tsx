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
import { RoleSelect } from "./RoleSelect";
import { useEffect, useState } from "react";
import { AddUser } from ".";

const userSchema = z.object({
  username: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["user", "admin"], { required_error: "Please select a role." }),
});

type CreateUserFormProps = React.ComponentPropsWithoutRef<"div"> & {
  addUser: AddUser;
  close: () => void;
};
type CreateUserP = z.infer<typeof userSchema>;

const createUser = async ({ username: email, ...p }: CreateUserP) => {
  const { data, error } = await supabase.rpc("create_user", { email, ...p });
  if (error) throw Error(error.message);

  return data;
};

const CreateUserForm = (p: CreateUserFormProps) => {
  const { className, close, addUser, ...props } = p;
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: "", password: "", role: "user" },
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
      .then((id) => addUser({ id, ...data }))
      .catch((error) => setError("root", { message: error.message }))
      .finally(close);

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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled={disabled}
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={disabled}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  disabled={disabled}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RoleSelect
                          onValueChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-red-500 text-sm h-2 text-center">
                  {errors?.root?.message}
                </div>
                <Button disabled={disabled} type="submit" className="w-full">
                  Submit
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
