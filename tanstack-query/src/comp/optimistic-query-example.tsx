import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );
  return res.json();
}

async function createPost(newPost: Omit<Post, "id">): Promise<Post> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return res.json();
}

export default function OptimisticExample() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const mutation = useMutation({
    mutationFn: createPost,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData<Post[]>(["posts"], (old = []) => [
        ...old,
        {
          id: Date.now(), // temporary id
          ...newPost,
        },
      ]);

      return { previousPosts };
    },

    // ❌ ROLLBACK if error
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },

    // 🔄 SYNC with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div>
      <h1>Optimistic Update Example</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />

      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <br />

      <button
        onClick={() => {
          mutation.mutate({ title, body });
          setTitle("");
          setBody("");
        }}
      >
        Add Post
      </button>

      <hr />

      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

/*
User clicks "Add"
→ UI updates instantly (optimistic)
→ Server request runs in background
→ If success → keep it
→ If error → undo it
*/
