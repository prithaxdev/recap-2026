import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

async function fetchPosts({ pageParam = 1 }): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${pageParam}`,
  );
  return res.json();
}

export default function InfiniteScrollExample() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,

      // 🔥 controls next page
      getNextPageParam: (lastPage, allPages) => {
        // if no data returned → no more pages
        if (lastPage.length === 0) return undefined;
        return allPages.length + 1;
      },
    });

  // 🔥 Auto load on scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Error loading posts</p>;

  return (
    <div>
      <h1>Infinite Scroll Example</h1>

      {data.pages.map((page, i) => (
        <div key={i}>
          {page.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      ))}

      {/* 👇 Trigger element */}
      <div ref={loadMoreRef} style={{ height: "50px" }} />

      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more data</p>}
    </div>
  );
}
