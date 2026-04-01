# LinkForge ⚡

> Your links. One page. Zero friction.

LinkForge is a modern **link-in-bio page generator** — create a beautiful, public page with all your important links in seconds, no signup required.

🔗 **Live Preview:** [linkforge.lovable.app](https://linkforge.lovable.app)

---

## ✨ Features

### 🏠 Landing Page
- Animated hero section with Framer Motion stagger effects
- Live username availability check against the database
- Animated background blobs and scroll-triggered reveals
- Stats strip, feature cards, and CTA section

### 📝 Editor (`/edit/:username`)
- **Token-based auth** — no login needed. An `edit_token` grants access; save the link to edit later.
- **Profile section** — display name, bio, location, avatar URL
- **Links management** — add, reorder (drag-and-drop via dnd-kit), enable/disable, delete
- **Link types** — regular links, separators (line/text/space), embeds (YouTube, Spotify)
- **Scheduled links** — set "show from" / "show until" dates; links auto-hide outside the window
- **Header banner** — solid color, gradient, or image with adjustable height; avatar overlaps the banner
- **12 themes** — Default, Minimal, Glassmorphism, Neon, Pastel, Brutalist, Gradient Pop, Terminal, Elegant, Retro, Y2K, Anime
- **Theme overrides** — button style (filled/outline/soft/pill), border-radius slider, font family picker, hide branding toggle
- **Animations config** — entrance style (fade-up, scale-up, slide-left, etc.), speed, hover effects
- **Custom CSS** — advanced textarea (max 2000 chars) injected as `<style>` on the public page
- **Social icons** — GitHub, LinkedIn, Twitter/X, Instagram, YouTube, TikTok, Email, WhatsApp
- **QR Code** — dynamically generated with theme-colored foreground, downloadable as PNG
- **Share section** — copy page URL, copy edit link, QR code download
- **Keyboard shortcuts** — `Ctrl+S` save, `Ctrl+Shift+N` new link, `Ctrl+Shift+P` preview, `?` shortcuts modal
- **Templates** — Developer, Creator, Artist, Musician, Business, Anime Fan — pre-fill all fields with placeholder data
- **Multiple pages** — tokens stored in localStorage; "My Pages" dropdown in navbar

### 👤 Public Profile (`/:username`)
- Fetches page data from the database by username
- **Skeleton loader** while loading (pulsing avatar + placeholder rectangles)
- **Custom 404** — "This page doesn't exist yet" with "Create yours →" button
- **Theming** — full visual transformation based on selected theme (background, button style, fonts, colors)
- **Animations** — configurable entrance animations and hover effects via Framer Motion
- **Embeds** — inline YouTube player and Spotify mini-player for embed-enabled links
- **Scheduled links** — client-side date check hides links outside their active window
- **Separators** — visual dividers between link groups
- **Header banner** — color/gradient/image banner with overlapping avatar
- **Social icons bar** — clickable icons linking to social profiles
- **Share FAB** — floating action button using Web Share API (with clipboard fallback)
- **Link click tracking** — each click fires a `keepalive` fetch to `link_clicks` table
- **View counter** — incremented on every page load
- **Performance** — localStorage cache (5 min TTL), minimal JS, fast load
- **SEO** — dynamic `<title>` and Open Graph meta tags (client-side); static fallback meta in `index.html`

### 📊 Analytics Dashboard
- **Overview cards** — Total Views, Total Clicks, Click Rate, Top Link
- **Clicks over time** — line chart (last 30 days) via Recharts
- **Per-link breakdown** — bar chart and table with click counts
- **Referrer tracking** — stored in `link_clicks.referrer`

### 🌍 Explore Page (`/explore`)
- Grid of public pages with avatar, name, bio, link count, theme badge, view count
- Sort by: Most Viewed, Newest, Most Links
- Filter by theme (pill buttons)
- Search by username or display name
- Pagination: 12 pages per load with "Load More"

### 🌙 Dark Mode & App Themes
- System-wide dark mode toggle (syncs with OS preference + localStorage)
- 7 app color themes: Purple, Blue, Green, Amber, Cyan, Pink, Mono
- App themes affect editor/landing/explore — public pages use their own theme

### 📱 Responsive Design
- Mobile: editor switches to vertical layout with floating "Preview" button opening a full-screen modal
- Tablet: 50/50 split view
- Public page: mobile-first (max-width 480px, centered)

### 🐣 Easter Egg
- Username `rick` or `rickroll` auto-embeds "Never Gonna Give You Up" at the top of the page

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + CSS variables (HSL design tokens) |
| UI Components | shadcn/ui (Radix primitives) |
| Animations | Framer Motion |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| Backend | Lovable Cloud (Supabase) |
| Routing | React Router 6 |
| State | React Query (TanStack) |

---

## 📦 Database Schema

### `pages`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `username` | text | Unique username (URL slug) |
| `display_name` | text | Display name |
| `bio` | text | Short bio |
| `location` | text | Location string |
| `avatar_url` | text | Avatar image URL |
| `links` | jsonb | Array of link objects |
| `social_icons` | jsonb | Social media URLs |
| `theme` | text | Selected theme name |
| `theme_options` | jsonb | Theme overrides + header banner config |
| `edit_token` | text | Secret token for editing |
| `is_public` | boolean | Whether page appears in Explore |
| `view_count` | integer | Total page views |
| `created_at` | timestamp | Creation date |
| `updated_at` | timestamp | Last update |

### `link_clicks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `page_id` | uuid | FK → pages.id |
| `link_index` | integer | Index of clicked link |
| `link_url` | text | URL that was clicked |
| `referrer` | text | HTTP referrer |
| `created_at` | timestamp | Click timestamp |

---

## 🚀 Future Improvements

- **SSR / Next.js migration** — for proper dynamic Open Graph meta tags and faster initial render
- **Image uploads** — avatar and banner via cloud storage instead of URL input
- **Premium features** — custom domains, remove branding, priority support
- **Email notifications** — weekly analytics digest
- **A/B testing** — test different link orders or titles

---

## 📄 License

Built with [Lovable](https://lovable.dev).
