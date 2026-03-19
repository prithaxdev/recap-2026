import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function PostList() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      return res.json();
    },
    staleTime: 1000 * 5, // How long your data is considered fresh, during this time, TanStack Query will not refetch data, it will just use cached data instantly
    gcTime: 1000 * 10, // How long unused data stays in cache before being deleted, starts counting only when no component is using the query, after time passes -> data is removed from memory
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isFetching && <p>Fetching...</p>}
      {data &&
        data.map((post: { id: number; title: string; body: string }) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

function CachingExample() {
  const [show, setShow] = useState(true);
  const queryClient = useQueryClient();

  function invalidateQuery() {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div>
      <h2>Caching Example</h2>

      <button onClick={invalidateQuery}>Invalidate Query</button>

      <button onClick={() => setShow(!show)}>
        {show ? "Unmount" : "Mount"}
      </button>

      {show && <PostList />}
    </div>
  );
}

export default CachingExample;
