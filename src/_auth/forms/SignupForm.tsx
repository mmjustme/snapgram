import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidaton } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";
import { createUserAccount } from "@/lib/appwrite/api";

const SignupForm = () => {
  const isLoading = false;

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
    const newUser = await createUserAccount(values)

    console.log(newUser);
    // Example newUser:
    // "$id": "66253f31001f5b2f9e17",
    // "$createdAt": "2024-04-21T16:30:41.708+00:00",
    // "$updatedAt": "2024-04-21T16:30:41.708+00:00",
    // "name": "test1",
    // "registration": "2024-04-21T16:30:41.704+00:00",
    // "status": true,
    // "labels": [],
    // "passwordUpdate": "2024-04-21T16:30:41.704+00:00",
    // "email": "test1@gmail.com",
    // "phone": "",
    // "emailVerification": false,
    // "phoneVerification": false,
    // "prefs": {},
    // "accessedAt": "2024-04-21T16:30:41.704+00:00"
  }

return (
  <Form {...form}>
    <div className="sm-w-420 flex-center flex-col ">

      <img
        src="/assets/images/logo.svg"
        alt="logo"
      />

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
          {isLoading ? (
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
