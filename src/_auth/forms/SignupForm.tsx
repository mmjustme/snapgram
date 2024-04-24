import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidaton } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  // react-query mutation fn call
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount()
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()

  // shsdcn form - define form and validation
  const form = useForm<z.infer<typeof SignupValidaton>>({
    resolver: zodResolver(SignupValidaton),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // shsdcn form - Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidaton>) {
    // so now we call createUserAccount throw the useCreateUserAccount
    // and useCreateUserAccount call createUserAccount from appwrite/api
    // it's mean react-query create a level between appwrite and "SignupForm"
    const newUser = await createUserAccount(values);

    if (!newUser) {
      // If we failed to create user we'll see a toast
      return toast({ title: "Sign up failed. Please try again" });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      // If we failed to create user we'll see a toast
      return toast({ title: "Sign up failed. Please try again" });
    }

    // call and we get back boolean vaue
    // and if it's true we're goin to Home page
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({ title: "Sign up failed. Please try again" });
    }

    
  }

  return (
    <Form {...form}>
      <div className="sm-w-420 flex-center flex-col ">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account{" "}
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgramm, please enter your account
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} className="shad-input" />
                </FormControl>
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
                  <Input type="email" {...field} className="shad-input" />
                </FormControl>
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
                  <Input type="password" {...field} className="shad-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading..
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            {" "}
            Already have an account?
            <Link
              to={"/sign-in"}
              className="text-primary-500 text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
