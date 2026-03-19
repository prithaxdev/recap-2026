import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

async function fetchPosts() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );
  return res.json();
}

function QueryExample() {
  const [isLoadData, setIsLoadData] = useState(false);
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: isLoadData,
  });

  return (
    <div>
      <h1>Query Example</h1>

      {isLoading && <p>Loading...</p>}

      {error && <p>Some went wrong: {error.message}</p>}

      <button onClick={() => setIsLoadData(true)}>Load Data</button>

      <button onClick={() => refetch()}>Refetch</button>

      {posts &&
        posts.map((post: { id: number; title: string; body: string }) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        ))}
    </div>
  );
}

export default QueryExample;
