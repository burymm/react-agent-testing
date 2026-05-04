# Configuration

## package.json

```json
{
  "name": "next-demo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### Dependencies

| Package     | Version | Role                    |
|-------------|---------|-------------------------|
| next        | 16.2.4  | Framework               |
| react       | 19.2.4  | UI library              |
| react-dom   | 19.2.4  | React DOM renderer      |

### Dev Dependencies

| Package              | Version | Role                          |
|----------------------|---------|-------------------------------|
| tailwindcss          | ^4      | CSS framework                 |
| @tailwindcss/postcss | ^4      | Tailwind PostCSS plugin       |
| typescript           | ^5      | Type system                   |
| eslint               | ^9      | Linting                       |
| eslint-config-next   | 16.2.4  | Next.js ESLint preset         |
| @types/node          | ^20     | Node.js type definitions      |
| @types/react         | ^19     | React type definitions        |
| @types/react-dom     | ^19     | React DOM type definitions    |

## next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Минимальный конфиг — все опции используют значения по умолчанию.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts", "**/*.mts"],
  "exclude": ["node_modules"]
}
```

Ключевые опции:
- `strict: true` — строгая типизация
- `noEmit: true` — только проверка типов, без компиляции
- `moduleResolution: "bundler"` — оптимизировано для bundler-окружение
- `resolveJsonModule: true` — импорт JSON файлов
- `@/* → ./*` — path alias, корень = корень проекта

## eslint.config.mjs

ESLint 9 flat config:

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

- `core-web-vitals` — правила для Core Web Vitals
- `typescript` — TypeScript-specific правила
- `globalIgnores` — игнорирование build-артефактов

## postcss.config.mjs

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Единственный плагин — Tailwind CSS v4 PostCSS интеграция.

## globals.css

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

- `@import "tailwindcss"` — новый способ подключения Tailwind v4 (вместо `@tailwind base/components/utilities`)
- `@theme inline` — Tailwind v4 tokens для кастомных CSS-переменных
- Автоматическая тёмная тема через `prefers-color-scheme`
