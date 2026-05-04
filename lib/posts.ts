import postsData from '@/data/posts.json' with { type: 'json' };

export interface Post {
    id: string;
    title: string;
    date: string;
    text: string;
}

export function getAllPosts(): Post[] {
    return postsData as Post[];
}

export function getPostById(id: string): Post | undefined {
    return postsData.find((p: Post) => p.id === id);
}
