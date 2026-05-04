import Link from "next/link";

const navItems = [
  { href: "/", label: "Main" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-3xl items-center gap-8 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
