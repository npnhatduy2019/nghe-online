# 📏 Code Conventions — YTMusic Player

> **Last updated:** 2026-05-12 — All conventions below are actively followed in the codebase.

## General Rules

- **Language**: JavaScript (ES2022+), no TypeScript (keep it simple)
- **Framework**: Next.js 14+ with App Router
- **Styling**: Vanilla CSS (no Tailwind, no CSS-in-JS)
- **No class components**: Functional components + hooks only

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase `.js` | `AudioPlayer.js` |
| Hooks | camelCase with `use` prefix | `useAudioPlayer.js` |
| Utilities | camelCase `.js` | `formatTime.js` |
| Constants | camelCase `.js` | `constants.js` |
| CSS files | `globals.css` or `ComponentName.module.css` | `AudioPlayer.module.css` |
| API routes | `route.js` inside named folder | `app/api/search/route.js` |
| i18n | lowercase `.json` | `vi.json`, `en.json` |

## Component Structure

```javascript
'use client'; // Only if component uses client-side features

import { useState, useEffect } from 'react';
import styles from './ComponentName.module.css'; // or use globals.css

/**
 * ComponentName — Brief description of what this component does.
 * 
 * @param {Object} props
 * @param {string} props.title - Track title
 * @param {Function} props.onPlay - Called when play is clicked
 */
export default function ComponentName({ title, onPlay }) {
  // 1. Hooks
  const [state, setState] = useState(null);

  // 2. Effects
  useEffect(() => { /* ... */ }, []);

  // 3. Handlers
  const handleClick = () => { /* ... */ };

  // 4. Render helpers (if complex)
  const renderItem = (item) => ( /* ... */ );

  // 5. Return JSX
  return (
    <div className="component-name">
      {/* ... */}
    </div>
  );
}
```

## CSS Conventions

### Design Tokens (in `globals.css`)

```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-bg: #0f0f0f;
  --color-surface: #1a1a2e;
  --color-text: #e4e4e7;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;

  /* Borders & Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
}
```

### CSS Class Naming
- Use **kebab-case**: `.audio-player`, `.search-bar`
- BEM-inspired for variations: `.player-controls__button--active`
- Prefix state classes: `.is-playing`, `.is-visible`, `.has-queue`

### Mobile-First Media Queries
```css
.component { /* Mobile styles (default) */ }

@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

## API Route Structure

```javascript
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validate input
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Missing parameter: q' },
        { status: 400 }
      );
    }

    // Business logic
    const results = await doSomething(query);

    // Success response
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[API] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## State Management Rules

1. **Global state** → React Context (`PlayerContext`)
2. **Local state** → `useState` in component
3. **Persistent state** → `localStorage` via `useLocalStorage` hook
4. **Server state** → `fetch` in component or API route
5. **No Redux, no Zustand** — keep it simple

## Commit Message Format

```
type(scope): message

feat(player): add playback speed control
fix(search): handle empty results gracefully
style(player): improve mobile layout
docs(api): add stream endpoint documentation
refactor(queue): extract queue logic to hook
```

Types: `feat`, `fix`, `style`, `docs`, `refactor`, `test`, `chore`

## Accessibility

- All interactive elements must have `aria-label`
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- Ensure sufficient color contrast (WCAG AA)
- Focus management for modals and panels
- Keyboard navigable (Tab, Enter, Escape)

## Error Handling

- Always wrap API calls in try/catch
- Show user-friendly error messages (never raw errors)
- Log errors to console with `[ComponentName]` prefix
- Provide retry options for failed requests
