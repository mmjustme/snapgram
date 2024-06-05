import { GridPostList, Loader } from "@/components/shared";
import { useGetInfiniteUserPosts } from "@/lib/react-query/queries";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type UserPostsProps = {
  userId: string | "";
};

const UserPosts = ({ userId }: UserPostsProps) => {
  const { ref, inView } = useInView();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isPending: isPostLoading,
  } = useGetInfiniteUserPosts(userId);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div>
      {posts.pages.map((post, index) => (
        <div key={index}>
          <GridPostList posts={post?.documents} showUser={false} />
        </div>
      ))}

      {hasNextPage && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default UserPosts;
