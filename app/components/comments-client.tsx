'use client';

import { FormEvent, memo, useCallback, useMemo, useState } from 'react';
import { PostComment } from '@/lib/comments';

interface CommentsClientProps {
  postId: string;
  initialComments: PostComment[];
}

interface FormState {
  name: string;
  email: string;
  text: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  text?: string;
}

const CommentItem = memo(function CommentItem({ comment }: { comment: PostComment }) {
  const formattedDate = useMemo(() =>
    new Date(comment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    [comment.createdAt]
  );

  return (
    <li key={comment.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-1 flex items-center gap-2">
        <strong className="font-medium">{comment.name}</strong>
        {comment.email && <span className="text-sm text-zinc-400">{comment.email}</span>}
        <time className="ml-auto text-xs text-zinc-400">{formattedDate}</time>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">{comment.text}</p>
    </li>
  );
});

export function CommentsClient({ postId, initialComments }: CommentsClientProps) {
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [form, setForm] = useState<FormState>({ name: '', email: '', text: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.text.trim()) e.text = 'Text is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleBlur = useCallback((field: 'name' | 'email' | 'text') => {
    const e: FormErrors = {};
    if (field === 'name' && !form.name.trim()) e.name = 'Name is required';
    if (field === 'text' && !form.text.trim()) e.text = 'Text is required';
    if (field === 'email' && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors((prev) => {
      const next = { ...prev, ...e };
      if (e[field] === undefined) delete next[field];
      return next;
    });
  }, [form]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError(null);

    const optimistic: PostComment = {
      id: `temp-${Date.now()}`,
      postId,
      name: form.name.trim(),
      email: form.email.trim(),
      text: form.text.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [optimistic, ...prev]);
    setForm({ name: '', email: '', text: '' });

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, name: optimistic.name, email: optimistic.email, text: optimistic.text }),
      });

      if (!res.ok) throw new Error('Failed to add comment');

      const saved = await res.json();
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id
            ? { ...c, id: saved.id, createdAt: saved.createdAt }
            : c
        )
      );
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
      setServerError('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [postId, form]);

  const inputBase =
    'w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-500';

  const inputError = 'border-red-500 dark:border-red-500';
  const errorText = 'mt-1 text-sm text-red-500';

  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Comments</h2>

      {comments.length > 0 && (
        <ul className="flex flex-col gap-4">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}

      {comments.length === 0 && <p className="text-zinc-500">No comments yet</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {serverError && (
          <div className="rounded-lg border border-red-500/50 p-3 text-sm text-red-500">
            {serverError}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={() => handleBlur('name')}
          className={`${inputBase} ${errors.name ? inputError : ''}`}
        />
        {errors.name && <span className={errorText}>{errors.name}</span>}

        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onBlur={() => handleBlur('email')}
          className={`${inputBase} ${errors.email ? inputError : ''}`}
        />
        {errors.email && <span className={errorText}>{errors.email}</span>}

        <textarea
          placeholder="Comment"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          onBlur={() => handleBlur('text')}
          rows={3}
          className={`${inputBase} ${errors.text ? inputError : ''}`}
        />
        {errors.text && <span className={errorText}>{errors.text}</span>}

        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-full border border-solid border-black/[.08] px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
        >
          {submitting ? 'Sending...' : 'Add comment'}
        </button>
      </form>
    </section>
  );
}
