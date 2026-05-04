import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-16 py-32">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">Post not found</p>
            <Link href="/posts" className="font-medium text-zinc-950 underline dark:text-zinc-50">
                Back to posts
            </Link>
        </div>
    );
}
