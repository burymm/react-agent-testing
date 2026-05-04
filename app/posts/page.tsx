import { getAllPosts } from '@/lib/api';
import Link from 'next/link';

export default async function PostsPage() {
    const posts = await getAllPosts();

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="max-w-3xl min-w-2xl px-16 py-32">
                <h1 className="mb-8 text-3xl font-semibold">Posts</h1>
                <div className="flex flex-col gap-6">
                    { posts.map((post) => (
                        <article
                            key={ post.id }
                            className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
                        >
                            <h2 className="mb-2 text-xl font-medium uppercase font-bold">{ post.title }</h2>
                            <p className="text-zinc-600 dark:text-zinc-400">{ post.text }</p>
                            <Link href={`/post/${post.id}`}>Details</Link>
                        </article>
                    )) }
                </div>
            </div>
        </div>
    );
}
