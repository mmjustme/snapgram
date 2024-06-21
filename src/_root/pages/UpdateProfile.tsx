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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Loader, ProfileUploader } from "@/components/shared";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileUpdateValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

import {
  useGetCurrentUser,
  useUpdateUserProfile,
} from "@/lib/react-query/queries";
import { toast } from "@/components/ui/use-toast";

const UpdateProfile = () => {
  const { id } = useParams();
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const { data: currentUser } = useGetCurrentUser(id || "");
  const { mutateAsync: updateUser, isPending: isUpdating } =
    useUpdateUserProfile();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileUpdateValidation>>({
    resolver: zodResolver(ProfileUpdateValidation),
    defaultValues: {
      username: user?.username,
      name: user ? user?.name : "",
      email: user ? user?.email : "",
      bio: user ? user?.bio : "",
      file: [],
    },
  });

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  // 2. Define a submit handler.
  const handleUpdate = async (
    values: z.infer<typeof ProfileUpdateValidation>,
  ) => {
    // Do something with the form values.
    const updatedProfile = await updateUser({
      name: values.name,
      bio: values.bio,
      file: values.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
      userId: currentUser.$id,
    });

    if (!updatedProfile) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

    setUser({
      ...user,
      name: updatedProfile?.name,
      bio: updatedProfile?.bio,
      imageUrl: updatedProfile?.imageUrl,
    });
    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={36}
            height={36}
            className="invert-white"
          />
          <h1 className="h1-bold">Edit Profile</h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label"></FormLabel>
                  <FormControl>
                    <ProfileUploader
                      mediaUrl={user?.imageUrl}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center justify-end">
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap px-5 py-3"
              >
                {isUpdating ? <Loader /> : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
