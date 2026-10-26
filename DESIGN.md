# Resistencia Dashboard — Design System (DESIGN.md)
> Curated Design System specification inspired by Linear, Raycast, and VoltAgent principles from [awesome-design-md](https://github.com/voltagent/awesome-design-md).

---

## 1. Visual Theme & Atmosphere

### Ethos: High-End Developer Vault
- **Aesthetic**: Modern software craft — deep obsidian space, luminous ambient glow, hairline borders, and tactile micro-interactions.
- **Contrast**: High-contrast, crystal-clear typography with crisp white text on deep obsidian surfaces.
- **Zero Mud**: Eliminates washed-out yellow/beige tones in favor of clean, curated palettes:
  - **Dark Mode (Default)**: Deep Obsidian canvas (`#090B10`), sleek glass cards (`#11141E`), hairline borders (`rgba(255, 255, 255, 0.08)`), and electric accents (Indigo `#6366F1`, Emerald `#10B981`, Cyan `#38BDF8`).
  - **Light Mode**: Crisp Snow Slate canvas (`#F8FAFC`), pure white cards (`#FFFFFF`), slate-200 borders (`#E2E8F0`), and rich slate-900 text (`#0F172A`).

---

## 2. Color Palette & Roles

### Dark Mode (Flagship)
| Token | Value | Role |
|---|---|---|
| `--canvas-bg` | `#090B10` | Main deep background |
| `--surface-card` | `#11141E` | Card surface & dialog background |
| `--surface-elevated` | `#161927` | Popovers, dropdowns & elevated containers |
| `--surface-input` | `#141724` | Input fields, search bars, credential boxes |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | 1px hairline card borders |
| `--border-strong` | `rgba(255, 255, 255, 0.16)` | Focused inputs & hover outlines |
| `--border-glow` | `rgba(99, 102, 241, 0.35)` | Accent card hover glow |
| `--text-primary` | `#F8FAFC` | Headings, primary labels, active buttons |
| `--text-secondary` | `#94A3B8` | Subtitles, descriptions, inactive states |
| `--text-muted` | `#64748B` | Helper text, ID badges, placeholders |

### Light Mode (Crisp Clean)
| Token | Value | Role |
|---|---|---|
| `--canvas-bg` | `#F8FAFC` | Clean slate-50 background |
| `--surface-card` | `#FFFFFF` | Pure white cards with soft shadow |
| `--surface-elevated` | `#F1F5F9` | Elevated badges & dropdowns |
| `--surface-input` | `#F8FAFC` | Input fields with slate borders |
| `--border-subtle` | `#E2E8F0` | Clean slate hairline borders |
| `--text-primary` | `#0F172A` | Slate-900 high contrast text |
| `--text-secondary` | `#475569` | Slate-600 descriptive text |
| `--text-muted` | `#94A3B8` | Slate-400 placeholder text |

### Category Signature Accents
- **ndurance.si**: Electric Indigo / Violet (`#6366F1` / `#818CF8`)
- **AVD**: Cyan / Sky Blue (`#0EA5E9` / `#38BDF8`)
- **Nexlume**: Solar Amber / Gold (`#F59E0B` / `#FBBF24`)
- **Alchemist**: Mint Emerald (`#10B981` / `#34D399`)

---

## 3. Typography Scale

- **Display & Headings**: `Plus Jakarta Sans` (weights: 600, 700, 800) with `-0.025em` letter-spacing.
- **Body & UI**: `Inter` / `Plus Jakarta Sans` (weights: 400, 500, 600) with smooth anti-aliasing.
- **Monospace, Credentials & Code**: `JetBrains Mono` for passwords, usernames, URLs, and stats numbers with tabular figures (`tnum`).

```css
font-feature-settings: 'tnum' 1, 'cv02' 1, 'cv03' 1, 'cv04' 1, 'cv11' 1;
```

---

## 4. Motion & Animation Principles

1. **Spring Physics**:
   - Damping: `24`, Stiffness: `280`, Mass: `0.8` for natural, tactile spring physics.
2. **Gliding Active Indicators**:
   - Framer Motion `layoutId` on category filter pills and navigation tabs for smooth fluid transitions.
3. **Card Micro-interactions**:
   - `whileHover={{ y: -4, scale: 1.01 }}` with subtle border glow brightening.
4. **Credential Drawers**:
   - Silky smooth height unfold (`ease: [0.16, 1, 0.3, 1]`) with instant reveal.
5. **Copy Feedback**:
   - Spring scale pop `scale: [0.95, 1.1, 1]` with vibrant emerald status change.

---

## 5. Component Guidelines

- **Cards**: Deep rounded corners (`rounded-2xl` / `rounded-3xl`), 1px hairline border, top specular highlight (`inset 0 1px 0 0 rgba(255,255,255,0.06)`).
- **Pills**: Full pill radius (`rounded-full`), compact padding, crisp icons.
- **Buttons**:
  - Primary: High-contrast pill with subtle shadow and spring active scale `active:scale-[0.98]`.
  - Secondary: Translucent glass pill (`bg-white/5 border border-white/10 hover:bg-white/10`).
- **Inputs**: Rounded-2xl, inner background, clear focus ring with accent glow.
