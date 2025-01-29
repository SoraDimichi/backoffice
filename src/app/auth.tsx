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
import { useEffect, useState } from "react";
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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  terms: z
    .boolean()
    .optional()
    .refine((val) => val || true, {
      message: "You must accept the terms and conditions.",
    }),
});

type AuthFormProps = React.ComponentPropsWithoutRef<"div">;

function AuthInner({ className, ...props }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", terms: false },
  });

  const { setError, formState, watch, clearErrors } = form;
  const { errors, isSubmitting, isLoading, isSubmitted } = formState;
  const disabled = isSubmitting && isLoading && isSubmitted;

  useEffect(() => {
    const subscription = watch(() => "root" in errors && clearErrors("root"));
    return () => subscription.unsubscribe();
  }, [clearErrors, errors, watch]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth[
      isLogin ? "signInWithPassword" : "signUp"
    ]({ email: data.email, password: data.password });

    if (error) setError("root", { type: "manual", message: error.message });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your details to login to your account"
              : "Enter your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox required onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel htmlFor="terms" className="flex-1">
                          I agree to the terms and conditions
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="text-red-500 text-sm h-2 text-center">
                  {errors?.root?.message}
                </div>
                <Button type="submit" className="w-full" disabled={disabled}>
                  {form.formState.isLoading
                    ? isLogin
                      ? "Logging in..."
                      : "Registering..."
                    : isLogin
                      ? "Login"
                      : "Register"}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin((prev) => !prev)}
              className="underline underline-offset-4"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Auth = () => (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm">
      <AuthInner />
    </div>
  </div>
);
