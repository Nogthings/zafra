# Customizing the Theme

Zafra uses **Tailwind CSS v4** and **CSS Variables** for theming. This makes it very easy to update the look and feel of your application by just changing a few values.

## How to change colors

1.  Open `app/globals.css`.
2.  Locate the `:root` block (for light mode) and `.dark` or `@media (prefers-color-scheme: dark)` block (for dark mode).
3.  The colors are defined using **HSL (Hue, Saturation, Lightness)** values.

### Example

To change the **Primary** color (used for buttons, links, etc.) from Black to Blue:

**Old (Black):**
```css
--primary: oklch(0.21 0.006 285.885);
/* OR if using HSL */
--primary: hsl(240 5.9% 10%);
```

**New (Blue):**
```css
--primary: oklch(0.623 0.214 259.815);
/* OR if using HSL */
--primary: hsl(221.2 83.2% 53.3%);
```
**Important:** Ensure your variables include the color function (e.g. `hsl(...)` or `oklch(...)`).

## Useful Tools

You don't have to guess these values! You can use the [Shadcn UI Themes](https://ui.shadcn.com/themes) generator:

1.  Go to [ui.shadcn.com/themes](https://ui.shadcn.com/themes).
2.  Pick a "Base Color" or specific colors.
3.  Copy the code.
4.  Paste the variable values into your `app/globals.css`.

## Fonts

To change the font:
1.  Open `app/layout.tsx`.
2.  Import a different font from `next/font/google`.
3.  Update the `variable` name if needed.
4.  Update `app/globals.css` inside `@theme` block if you changed the variable name.
