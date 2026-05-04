import { Post } from '@/lib/posts';

async function getJson<T>(path: string): Promise<T | null> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
    if (res.status === 404) {
        return null;
    }
    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status}`);
    }
    return res.json();
}

export function getAllPosts(): Promise<Post[]> {
    return getJson<Post[]>('/api/posts') as Promise<Post[]>;
}

export function getPostById(id: string): Promise<Post | null> {
    return getJson<Post>(`/api/posts/${id}`) as Promise<Post | null>;
}
