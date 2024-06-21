import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";
import { Models } from "appwrite";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  console.log(currentUser);

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: { imageUrl: currentUser.imageUrl },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-4 w-full max-w-5xl">
        <img
          src="assets/icons/save.svg"
          alt="saved"
          height={30}
          width={30}
          className="invert-white"
        />
        <h1 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h1>
      </div>

      {/* {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )} */}

      {!currentUser ? (
        <Loader />
      ) : (
        <ul>
          {savePosts.lenth === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
