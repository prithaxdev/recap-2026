import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

async function createPost(newPost: { title: string; body: string }) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  return res.json();
}

function MutationExample() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {
    mutate: createPostMutation,
    data: newPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setTitle("");
      setBody("");
    },
  });

  return (
    <div>
      <h1>Mutation Example</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>
      <br />
      <button onClick={() => createPostMutation({ title, body })}>
        Create Post
      </button>
      {isPending && <p>Creating post...</p>}
      {isError && <p>Error: {error.message}</p>}
      {newPost && <p>Post created: {newPost.title}</p>}
    </div>
  );
}

export default MutationExample;
