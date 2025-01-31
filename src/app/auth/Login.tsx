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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginUserSchema = {
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .max(50, { message: "Email must be less than 50 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(30, { message: "Password must be less than 30 characters." }),
};

const loginSchema = z.object(loginUserSchema);

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginProps = React.ComponentPropsWithoutRef<"div"> & {
  toggle: () => void;
};

export const Login: React.FC<LoginProps> = ({ className, ...props }) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { setError, formState, watch, clearErrors } = form;
  const { errors, isSubmitting, isLoading, isSubmitted } = formState;
  const disabled = isSubmitting && isLoading && isSubmitted;

  useEffect(() => {
    const subscription = watch(() => {
      if ("root" in errors) {
        clearErrors("root");
      }
    });
    return () => subscription.unsubscribe();
  }, [clearErrors, errors, watch]);

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) setError("root", { type: "manual", message: error.message });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your details to login to your account
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

                <div className="text-red-500 text-sm h-2 text-center">
                  {errors?.root?.message}
                </div>
                <Button type="submit" className="w-full" disabled={disabled}>
                  {form.formState.isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={props.toggle}
              className="underline underline-offset-4"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
