import fs from 'fs';
import path from 'path';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

export interface PostComment {
  id: string;
  postId: string;
  name: string;
  email: string;
  text: string;
  createdAt: string;
}

// In-memory cache — avoids file writes that trigger Turbopack hot reload
let cache: PostComment[];

function loadCache(): PostComment[] {
  if (!cache) {
    const raw = fs.readFileSync(COMMENTS_FILE, 'utf-8');
    cache = JSON.parse(raw) as PostComment[];
    console.log('---------', cache);
  }
  return cache;
}

export function getCommentsByPostId(postId: string): PostComment[] {
  return loadCache()
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(comment: Omit<PostComment, 'id' | 'createdAt'>): PostComment {
  const all = loadCache();
  const newComment: PostComment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all.push(newComment);
  return newComment;
}
