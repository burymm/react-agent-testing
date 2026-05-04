import { getPostById, generatePostIds } from '@/lib/posts';
import NotFound from '@/app/post/[id]/not-found';
import { CommentsSection } from '@/app/components/comments-section';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        return (
            <NotFound></NotFound>
        );
    }

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="max-w-3xl min-w-2xl px-16 py-32">
                <h1 className="mb-2 text-3xl font-semibold uppercase font-bold">{post.title}</h1>
                <p className="mb-6 text-sm text-zinc-500">{post.date}</p>
                <p className="text-zinc-600 dark:text-zinc-400">{post.text}</p>

                <CommentsSection postId={id} />
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const ids = await generatePostIds();
    return ids.map((id) => ({ id }));
}
