
# Health & Wellness Bible — Full Implementation Plan

## Overview
A comprehensive web-based health reference app with searchable recipes, remedies, herbs, oils, acupressure points, prevention guides, emergency references, and cultural narratives. Read-only for now (no auth). Built with React + Vite + Tailwind + Supabase.

---

## Phase 1: Database Setup (Supabase)

Create all tables with proper relationships:

- **sources** — citations and references
- **herbs** — latin name, common name, synonyms, description, uses, cautions, evidence_label
- **recipes** — title, purpose, ingredients (jsonb), method, storage, cautions, evidence_label, source_id (FK)
- **remedies** — condition, method, materials, steps, cautions, evidence_label, source_id (FK)
- **oils** — name, application_methods, dilutions, cautions, evidence_label, source_id (FK)
- **acupressure_points** — point_name, condition, location_description, steps, cautions, evidence_label
- **charts** — title, category, data (jsonb), description, effective_date
- **narratives** — title, content, related_topic, evidence_label

Junction tables: `recipe_remedies`, `remedy_herbs`, `remedy_oils`, `remedy_acupressure`

Seed with sample data: Dashi broth recipe, sinus oil blend, basic exam schedule, sample herb entries, etc.

Enable Row Level Security with public read access on all tables.

---

## Phase 2: App Structure & Navigation

- **Persistent sidebar** (desktop) with sections: Home, Recipes, Remedies, Herbs, Oils, Acupressure, Prevention, Emergency, Screening, Educational Tools, Cultural Narratives
- **Mobile hamburger menu**
- **Dark/light mode toggle** in header
- **Medical disclaimer banner** on relevant pages
- **Two-column layout**: main content left, related cross-references right

---

## Phase 3: Pages (11 pages)

1. **Landing / Preface** — App intro, purpose, ethical boundaries, section navigation cards
2. **Recipe Library** — Grid of recipe cards with search/filter, click to detail page (`/recipes/:id`)
3. **Remedy Lookup** — Index of conditions with linked recipes, herbs, oils, acupressure points (`/remedies/:id`)
4. **Herbs Catalog** — Searchable herb list with detail pages (`/herbs/:id`)
5. **Oils Catalog** — Oil entries with application methods, dilutions (`/oils/:id`)
6. **Acupressure Index** — Point catalog with location descriptions and steps (`/acupressure/:id`)
7. **Prevention & Lifestyle** — Charts for water intake, sodium/fiber limits, portion sizes, food classification
8. **Emergency & First Aid** — Quick-reference cards for first aid kit, poisoning actions, symptom comparison charts
9. **Screening & Lifecycle Care** — Filterable tables for exams/vaccinations by age and gender
10. **Educational Tools** — Mnemonics for vitamins/minerals, interactive chart pages
11. **Cultural Narratives** — Blog-style pages linking back to relevant entries (`/narratives/:id`)

---

## Phase 4: Search & Filters

- **Global search bar** in header — full-text search across recipes, remedies, herbs, oils, conditions
- **Filter controls** on list pages: evidence label (Traditional/Observed/Supported/Speculative), category, keywords
- Search results page showing grouped results by type

---

## Phase 5: Cross-References & Evidence Labels

- Each detail page shows related entries (e.g., a remedy links to its herbs, oils, recipes)
- Evidence label badges (color-coded) on every entry
- Disclaimer text on all remedy/recipe/herb pages

---

## Phase 6: Charts & Data Visualization

- Use Recharts (already installed) for nutrition tables, exam schedules, vaccine timelines
- Render chart data from the `charts` table (JSON-driven)
- Symptom comparison tables (cold vs flu vs H1N1)

---

## Phase 7: Responsive Design & Accessibility

- Mobile-first responsive layouts across all pages
- Proper semantic HTML, ARIA labels, keyboard navigation
- Two-column layout collapses to single column on mobile
- Dark/light mode support throughout

---

## Design Notes
- Clean, warm color palette suitable for a health/wellness reference
- Card-based layouts for browsable content
- Clear typography hierarchy for readability
- Evidence label color coding: green (Supported), blue (Observed), amber (Traditional), gray (Speculative)
