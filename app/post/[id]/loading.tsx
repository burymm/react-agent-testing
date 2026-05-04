export default function CommentsLoading() {
  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Comments</h2>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            </div>
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
          </div>
        ))}
      </div>
    </section>
  );
}
