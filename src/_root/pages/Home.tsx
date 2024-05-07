import { Loader, PostCard } from "@/components/shared";
import { useGetPosts } from "@/lib/react-query/queries";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isPending: isPostLoading,
  } = useGetPosts();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts.pages.map((post, i) => (
                <React.Fragment key={i}>
                  {post?.documents.map((item) => (
                    <li
                      className="flex justify-center w-full"
                      key={item.caption}
                    >
                      <PostCard post={item} />
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

        {hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
