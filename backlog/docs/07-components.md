# Components

## Navbar — `app/components/navbar.tsx`

Навигационная панель, отображается на всех страницах через Root Layout.

```tsx
export function Navbar() {
  const navItems = [
    { href: "/", label: "Main" },
    { href: "/posts", label: "Posts" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-3xl items-center gap-8 py-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="...">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

### Стили

- Фон: белый (светлая тема) / чёрный (тёмная тема)
- Нижняя граница: `zinc-200` / `zinc-800`
- Ширина контента: `max-w-3xl`
- Ссылки: `zinc-600` → `black` при hover (dark: `zinc-400` → `white`)
- Transition на color при hover

### Навигационные элементы

| Label  | Route     |
|--------|-----------|
| Main   | `/`       |
| Posts  | `/posts`  |
| About  | `/about`  |
