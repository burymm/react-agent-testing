import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-16 py-32 text-center">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Built by Claude
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          an AI agent by Anthropic
        </p>
      </div>

      {/* Description */}
      <p className="max-w-md text-base leading-7 text-zinc-500 dark:text-zinc-400">
        next-demo — a Next.js 16 blog with JSONPlaceholder integration.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-row gap-4">
        <Link
          href="/posts"
          className="rounded-full border border-solid border-black/[.08] px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
        >
          Posts
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-solid border-black/[.08] px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-white/[.06]"
        >
          About
        </Link>
      </div>

      {/* Credits */}
      <div className="flex flex-col items-center gap-1 pt-8 text-sm text-zinc-400 dark:text-zinc-500">
        <p>Team lead: <strong className="text-zinc-600 dark:text-zinc-300">Mikalai Bury</strong> (<a href="https://github.com/burymm" className="underline transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">burymm</a>)</p>
        <p>LLM: <strong className="text-zinc-600 dark:text-zinc-300">Claude</strong> by Anthropic</p>
      </div>
    </main>
  );
}
