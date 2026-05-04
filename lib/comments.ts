export interface PostComment {
  id: string;
  postId: string;
  name: string;
  email: string;
  text: string;
}

interface JsonPlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

function mapComment(c: JsonPlaceholderComment): PostComment {
  return {
    id: String(c.id),
    postId: String(c.postId),
    name: c.name,
    email: c.email,
    text: c.body,
  };
}

export async function getCommentsByPostId(postId: string): Promise<PostComment[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
  const data: JsonPlaceholderComment[] = await res.json();
  return data.map(mapComment);
}
