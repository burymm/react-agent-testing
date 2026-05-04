export interface Post {
    id: string;
    title: string;
    date: string;
    text: string;
}

interface JsonPlaceholderPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

function mapPost(p: JsonPlaceholderPost): Post {
    return {
        id: String(p.id),
        title: p.title,
        date: new Date().toLocaleDateString('en-US'),
        text: p.body,
    };
}

async function fetchAllPosts(): Promise<JsonPlaceholderPost[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
}

async function fetchSinglePost(id: number): Promise<JsonPlaceholderPost | null> {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { next: { revalidate: 3600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch post ${id}: ${res.status}`);
    return res.json();
}

export async function getAllPosts(): Promise<Post[]> {
    const data = await fetchAllPosts();
    return data.map(mapPost);
}

export async function getPostById(id: string): Promise<Post | null> {
    const data = await fetchSinglePost(Number(id));
    return data ? mapPost(data) : null;
}

export async function generatePostIds(): Promise<string[]> {
    const data = await fetchAllPosts();
    return data.map((p) => String(p.id));
}
