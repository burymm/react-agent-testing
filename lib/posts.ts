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

const allPostsPromise = fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600 },
}).then((r) => r.json() as Promise<JsonPlaceholderPost[]>);

export async function getAllPosts(): Promise<Post[]> {
    const data = await allPostsPromise;
    return data.map(mapPost);
}

export async function getPostById(id: string): Promise<Post | null> {
    const data = await allPostsPromise;
    const found = data.find((p) => String(p.id) === id);
    return found ? mapPost(found) : null;
}

export async function generatePostIds(): Promise<string[]> {
    const data = await allPostsPromise;
    return data.map((p) => String(p.id));
}
