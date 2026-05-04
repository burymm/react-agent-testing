import { memo, useMemo } from 'react';
import { PostComment } from '@/lib/comments';

const CommentItem = memo(function CommentItem({ comment }: { comment: PostComment }) {
  return (
    <li key={comment.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-1 flex items-center gap-2">
        <strong className="font-medium">{comment.name}</strong>
        <span className="text-sm text-zinc-400">{comment.email}</span>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">{comment.text}</p>
    </li>
  );
});

export function CommentsClient({ initialComments }: { initialComments: PostComment[] }) {
  const count = useMemo(() => initialComments.length, [initialComments.length]);

  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Comments ({count})</h2>

      {count > 0 && (
        <ul className="flex flex-col gap-4">
          {initialComments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}

      {count === 0 && <p className="text-zinc-500">No comments yet</p>}
    </section>
  );
}
