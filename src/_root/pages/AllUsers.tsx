import { Loader, UserCard } from "@/components/shared";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queries";

const AllUsers = () => {
  const { toast } = useToast();
  const { data: creators, isError, isLoading } = useGetUsers();

  if (isError) {
    toast({
      title: "Something went wrong.",
    });
    return;
  }

  return (
    <div className="common-container">
      <div className="flex items-center gap-2 w-full max-w-5xl">
        <img
          src="assets/icons/people.svg"
          alt="people"
          className="invert-white w-7 h-7 object-fit"
        />
        <h2 className="h2-bold ">All Users</h2>
      </div>
      <div className="">
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="flex flex-wrap w-full flex-center ">
            {creators?.documents.map((creator) => (
              <li
                key={creator.$id}
                className="w-full max-w-[250px] my-7 mx-4 py-3 px-2"
              >
                <UserCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
