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
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginUserSchema } from "./Login";

export const createUserSchema = {
  ...loginUserSchema,
  first_name: z
    .string()
    .min(1, { message: "First name is required." })
    .max(20, { message: "First name must be less than 20 characters." }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(20, { message: "Last name must be less than 20 characters." }),
};

const registerSchema = z.object({
  ...createUserSchema,
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterProps = React.ComponentPropsWithoutRef<"div"> & {
  toggle: () => void;
};

export const Register: React.FC<RegisterProps> = ({ className, ...props }) => {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const { setError, formState, watch, clearErrors } = form;
  const { errors, isSubmitting, isLoading, isSubmitted } = formState;
  const disabled = isSubmitting && isLoading && isSubmitted;

  useEffect(() => {
    const subscription = watch(() => {
      if ("root" in errors) clearErrors("root");
    });
    return () => subscription.unsubscribe();
  }, [clearErrors, errors, watch]);

  const onSubmit = (data: RegisterFormValues) => {
    supabase.auth
      .signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      })
      .then(({ error }) => {
        if (error) setError("root", { type: "manual", message: error.message });
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
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
                      <FormDescription>Your given name.</FormDescription>
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
                      <FormDescription>Your family name.</FormDescription>
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
                      <FormDescription>
                        We'll never share your email.
                      </FormDescription>
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
                        Enter your secure password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          disabled={disabled}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor="terms" className="flex-1">
                        I agree to the terms and conditions
                      </FormLabel>
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
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={props.toggle}
              className="underline underline-offset-4"
            >
              Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
