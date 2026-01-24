# Font Setup Guide

## Installed Fonts

This project now includes:

1. **Framer Motion** - Animation library
2. **Geist Sans** - Modern sans-serif font from Vercel
3. **Geist Mono** - Monospace font from Vercel
4. **Faculty Glyphic** - Display serif font from Google Fonts

## Usage

### In Tailwind Classes

The fonts are available through Tailwind utility classes:

```tsx
// Geist Sans (default body font)
<div className="font-sans">Default text</div>

// Geist Mono
<div className="font-mono">Code or monospace text</div>

// Faculty Glyphic (display font)
<div className="font-display">Headings and display text</div>
```

### CSS Variables

You can also use the CSS variables directly:

```css
.custom-class {
  font-family: var(--font-geist-sans);
  /* or */
  font-family: var(--font-geist-mono);
  /* or */
  font-family: var(--font-faculty-glyphic);
}
```

### Framer Motion

Import and use Framer Motion for animations:

```tsx
import { motion } from 'framer-motion';

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Animated content
    </motion.div>
  );
}
```

## Example Usage

```tsx
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h1 className="font-display text-6xl font-bold">
        Beautiful Heading
      </h1>
      <p className="font-sans text-lg">
        Body text using Geist Sans
      </p>
      <code className="font-mono text-sm">
        const code = "example";
      </code>
    </motion.section>
  );
}
```

## Font Characteristics

- **Geist Sans**: Clean, modern sans-serif ideal for body text and UI elements
- **Geist Mono**: Optimized monospace font for code blocks
- **Faculty Glyphic**: Elegant display serif font perfect for headings and emphasis
