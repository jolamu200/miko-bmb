# Product Philosophy

- **Semantic children** - use `info`, `actions` props, not ambiguous `children` 
- **Closed prop surfaces** - no `className` allowed, no `HTMLAttributes` extends
- **Component owns decisions** - position, width, padding are fixed internally
- **New behavior = new component** - don't add variants for structure changes
- **No dead code** - delete unused props, unreachable variants
- **No compound leakage** - keep slots internal, expose props API
- **Iconify** - @iconify/react for icons

### React 19

- **No forwardRef** - `ref` is a regular prop
- **No displayName** 
- **No manual memo** - React Compiler handles it → verify: grep `React.memo`, `useMemo`, `useCallback`
- **Tailwind v4 syntax** - use `text-(--color)` not `text-[var(--color)]`

### Component Patterns

- **BaseUI for primitives** - [accessible base components](https://base-ui.com/react/overview/quick-start)
- **JSDoc on components** - brief description on function

### Organization

- **Promotion rule** - 1 feature = local, 2 = tolerate, 3+ = promote to `src/ui/`
- **Feature isolation** - feature components in `features/[name]/components/`
- **Design tokens** - use `@theme` tokens in `styles/`, not magic values

### Client-Only

- **No SSR handling** - client-only package, skip hydration guards

## Accessibility Rules (Biome)

- **Keyboard & Focus:** No accessKey, no autoFocus, no positive tabIndex, onClick needs keyboard handler, onMouseOver needs onFocus, interactive elements must be focusable

- **ARIA:** No aria-hidden on focusable, no ARIA on unsupported elements, roles need required props, props must match role, props/roles/values must be valid, aria-activedescendant needs tabIndex

- **Semantic HTML:** Prefer semantic elements over roles, no redundant explicit roles, scope only on `<th>`, buttons need type, html needs lang (valid ISO)

- **Interactive vs Non-interactive:** No handlers/roles/tabIndex on non-interactive, no non-interactive roles on interactive, static elements with handlers need role

- **Content:** Images need alt (no "image/picture/photo of ..."), SVG needs title, anchors need content + be navigable, headings need content, iframes need title, labels need htmlFor, audio/video need captions, autocomplete must be valid