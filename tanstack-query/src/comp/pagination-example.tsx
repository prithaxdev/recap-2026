import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

async function fetchPosts(page: number): Promise<Post[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`,
  );
  return res.json();
}

export default function PaginationExample() {
  const [page, setPage] = useState(1);

  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["posts", page], // 🔥 page is important
    queryFn: () => fetchPosts(page),
    placeholderData: (prevData) => prevData, // 👈 like keepPreviousData (v5)
  });

  return (
    <div>
      <h1>Pagination Example</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}

      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}

      {/* 🔽 Pagination Controls */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>Page: {page}</span>

        <button onClick={() => setPage((old) => old + 1)}>Next</button>
      </div>

      {/* 🔄 Background fetching indicator */}
      {isFetching && <p>Updating...</p>}
    </div>
  );
}
