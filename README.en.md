<div align="center">

<img src="public/images/amazon-com-fundo-branco.png" alt="Amazon Aquabio logo" width="420" />

# Amazon Aquabio

**A web platform to explore the mitogenomic diversity of Amazonian fish.**

🌐 **[Open the application](https://julio-csilva.github.io/Amazon_Aquabio/)**

🇬🇧 English &nbsp;|&nbsp; 🇧🇷 [Português](README.md)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2-319795?logo=chakraui&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222?logo=github&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)
![Images](https://img.shields.io/badge/Images-CC_BY--NC--SA-blue)

</div>

---

## 📖 About

**Amazon Aquabio** is a bilingual (Portuguese / English) single-page application (SPA) that presents the results
of a **mitogenomics study of Amazonian fish**. Through *data mining* of public **NCBI** repositories, the project
reconstructed **100 mitogenomes from 34 species** of Amazonian fish and makes the following available
interactively:

- a species gallery with their conservation data (IUCN Red List);
- the analyses for each sample — **synteny, RSCU and D-loop tandem repeats are interactive**, computed from the data the site itself publishes; circularized mitogenome and tRNA remain as images;
- a **comparison tool** to view selected samples side by side;
- the full methodology of the bioinformatics pipeline;
- a map of species distribution across the Amazon basin;
- the research team and a contact channel.

The project is maintained by the **BioME (Bioinformatics Multidisciplinary Environment)** group at the
**Digital Metropolis Institute (IMD/UFRN)**.

---

## ✨ Features

- 🌍 **Bilingual (PT-BR / EN)** — real-time language switching via React Context.
- 🐟 **Species gallery** — search by common name, scientific name, or SRA accession, with an IUCN Red List status filter.
- 🔬 **Detail modal** — per-species sheet with description, image license, per-sample tabs and an analysis carousel, with *zoom* and FASTA / NCBI / Genes FASTA downloads.
- 🧪 **Comparison tool** — select multiple samples (SRAs) and open a comparative view in a new tab.
- 🗺️ **Interactive map** — distribution of the 34 species across the Amazon basin (embedded map).
- 📚 **Interactive methodology** — pipeline cards per step, with a diagram and highlighted regions in a modal.
- 👥 **Researchers carousel** — with links to Lattes, LinkedIn and ORCID.
- 📨 **Contact form** — message sending via [EmailJS](https://www.emailjs.com/) + an institutional location map.
- 📱 **Responsive** — layout adapted for *desktop* and *mobile* (drawer menu, fluid grids).

---

## 🧬 The study (summary)

| Item | Value |
|------|-------|
| Species analyzed | **34** |
| Reconstructed mitogenomes | **100** |
| Predominant family | *Cichlidae* |
| Data source | Public **NCBI / SRA** repositories (notably project `PRJEB48774` — Sanger Institute) |
| Seed mitogenome | *Pygocentrus nattereri* (`NC_015840.1`) |
| Sequencing technology | Illumina *paired-end* (WGS) |

---

## 🛠️ Tech stack

| Area | Tools |
|------|-------|
| **Core** | [React 18](https://react.dev/), [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) (`createHashRouter`, lazy routes) |
| **UI / styling** | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) on [Radix](https://www.radix-ui.com/) |
| **Animation** | [Motion](https://motion.dev/) (gestures, layout, `AnimatePresence`), [GSAP + ScrollTrigger](https://gsap.com/) (scroll-driven scenes: section tint, mitogenome tracing, pinned methodology, sequence strip, header rules) |
| **Charts** | [Plotly.js](https://plotly.com/javascript/) (`cartesian` bundle, loaded on demand) |
| **Map** | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/), OpenStreetMap tiles |
| **Typography** | Space Grotesk · Inter · JetBrains Mono, via [Fontsource](https://fontsource.org/) (variable `woff2`) |
| **Images** | [sharp](https://sharp.pixelplumbing.com/) generating AVIF/WebP at several widths |
| **Icons** | [lucide-react](https://lucide.dev/) (interface) and [react-icons](https://react-icons.github.io/react-icons/) (brand marks) |
| **Form** | [@emailjs/browser](https://www.emailjs.com/) |
| **Quality / deploy** | [ESLint 9](https://eslint.org/) (flat config), [gh-pages](https://github.com/tschaub/gh-pages) |

---

## 📂 Project structure

Structural folders are named in English (React convention); **domain terms stay
in Portuguese**, because the JSON keys produced by `pipeline/` are Portuguese
(`especie`, `amostras`, `comprimento`, `rotulos`) and renaming them would break
the contract with the Python scripts.

```
Amazon_Aquabio/
├── index.html                  # root HTML (meta, OG, favicons, manifest)
├── vite.config.js              # base "/Amazon_Aquabio/", @/ alias, Plotly chunk
├── eslint.config.js            # ESLint 9, flat config
├── components.json             # shadcn/ui (Cult UI and Skiper UI registries)
├── .env.example                # EmailJS keys (copy to .env.local)
├── scripts/
│   ├── otimizar-imagens.mjs    # PNG/JPG -> AVIF/WebP + manifest (runs on prebuild)
│   ├── fluxograma-metodologia.mjs # draw.io exports -> the 5 step images (aligned + veiled)
│   ├── extrair-ocorrencias.mjs # mapa_peixes.html -> data/ocorrencias.json
│   └── conferir-arquivos.mjs   # reports paths listed in especies.json but missing
├── public/
│   ├── data/                   # 📊 fetched at runtime
│   │   ├── sintenia.json       #   gene order and coordinates, 100 samples
│   │   ├── rscu.json           #   RSCU per sample + group consensuses
│   │   ├── tandem_repeats.json #   control-region repeats, 32 species
│   │   ├── ocorrencias.json    #   1,136 occurrence points, 30 species
│   │   └── atribuicoes.json    #   licence proofs (kept out of the JS bundle)
│   ├── images/                 # originals + AVIF/WebP variants (variants git-ignored)
│   └── docs/b8/                # FASTA, genes and NCBI metadata for download
├── pipeline/                   # ⚙️ analysis JSON generation (Python, stdlib)
└── src/
    ├── main.jsx                # entry: Providers + RouterProvider
    ├── app/                    # router, Layout, providers, secoes.js
    ├── styles/
    │   ├── tokens.css          # 🎨 SINGLE source of colour and type ("Dark Waters")
    │   └── globals.css         # document base, utilities, reduced motion
    ├── i18n/                   # pt.js · en.js · provider · context
    ├── theme/                  # light/dark switching
    ├── lib/                    # utils · assets · iucn · especies · format · atribuicoes
    ├── hooks/                  # useScrollSpy · useReducedMotion
    ├── data/                   # especies.json · researchers · methodology · imagens.json
    ├── components/
    │   ├── ui/                 #   shadcn primitives + <Figura>
    │   ├── motion/             #   Reveal · Marquee · Contador · Caustics
    │   └── layout/             #   Header · Footer · toggles
    ├── features/
    │   ├── hero/               #   depth parallax
    │   ├── mitogenome/         #   🧬 circular SVG map built from sintenia.json
    │   ├── stats/              #   counters + infinite species marquee
    │   ├── map/                #   React map (Leaflet), loaded on demand
    │   ├── methodology/        #   pinned scene (GSAP ScrollTrigger)
    │   ├── gallery/            #   filterable grid + full-screen detail
    │   ├── comparator/         #   SRA selection + floating island
    │   ├── researchers/        #   the team
    │   └── analises/           #   📈 Plotly figures (paper surface)
    └── pages/                  # HomePage · ContactPage · ComparisonPage · NotFoundPage
```

---

## 📈 Interactive analyses

Synteny, RSCU and control-region tandem repeats are no longer PNGs: they are
drawn in the browser from data versioned under `public/data/`. What changes:

- **Comparing is now a single figure.** In the comparison tool the selected
  samples share one axis instead of becoming N stacked images.
- **Every value is auditable.** Synteny and RSCU are computed from the
  `_genes.fa` files the site distributes: download one, run
  `pipeline/build_rscu.py`, and you get the number on screen.
- **The site got lighter.** The three JSON files total ~170 KB against the
  14 MB of PNGs they replaced, and Plotly (~477 KB gzip) is only downloaded by
  visitors who open an analysis.

To regenerate the data:

```bash
python3 pipeline/build_all.py --validar
```

Conventions, quality caveats and a discrepancy found in the published RSCU are
documented in [`pipeline/README.md`](pipeline/README.md).

---

## 🗂️ Data model

The content is data-driven, defined in [`src/fotos.json`](src/fotos.json). Each **species** holds a list of
**samples** (`amostras`), and each sample references the images and files produced by the pipeline.

```jsonc
{
  "especie": "Acarichthys heckelii",   // scientific name
  "nome": "Ciclídeo cabeça de ouro",   // common name (PT)
  "nome_en": "Threadfin acara",        // common name (EN)
  "path": "images/b3/Acarichthys_heckelii_by(Nilsson_Kjell).jpg",
  "by": "by(Nilsson_Kjell)",           // image attribution
  "descricao": "...",                  // description (PT)
  "descricao_en": "...",               // description (EN)
  "redlist_status": "LC",              // IUCN status: NE, DD, LC, NT, VU, EN, CR, EW, EX
  "id": 0,
  "tagId": 2,
  "amostras": [
    {
      "id": 1,
      "sra": "ERR10768189",            // NCBI SRA accession
      "path_mito_circularized": "images/b8/circularized/...png",
      "path_trna":              "images/b8/trna/...png",
      "path_circos":            "images/b8/circos/...png",
      "path_coverage":          "images/b8/coverage/...png",
      "path_fasta":             "docs/b8/fasta/...fa",       // download: mitogenome
      "path_gensFasta":         "docs/b8/gens_fasta/...fa",  // download: genes
      "path_NCBI":              "docs/b8/NCBI/...txt"         // download: metadata
    }
  ]
}
```

> 📌 **To add a species/sample:** insert the object into `src/fotos.json` and place the corresponding
> images/files under `public/images/b8/...` and `public/docs/b8/...`, following the `path_*` naming convention.

The file [`src/by_links.json`](src/by_links.json) stores the attribution images (as *base64*), linked to each
species by `id`.

---

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) **20+** (LTS recommended)
- npm (ships with Node) or another package manager

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Julio-CSilva/Amazon_Aquabio.git
cd Amazon_Aquabio

# 2. Install dependencies
npm install

# 3. (Optional) Configure the contact form
cp .env.example .env.local   # then fill in the EmailJS keys

# 4. Start the development server
npm run dev
```

The app runs at **http://localhost:5173/Amazon_Aquabio/** — the path comes from
`base` in `vite.config.js`, which exists because the site is served from a
GitHub Pages sub-path.

> Without `.env.local` everything still works: the contact form renders and says
> sending is not configured, rather than failing silently.

> The **first** `npm run build` generates the image variants (~6 min, once). To
> get it out of the way earlier: `npm run imagens`.

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server (Vite + HMR). |
| `npm run build` | Production build into `dist/`. Triggers `prebuild` first. |
| `npm run preview` | Preview the build locally, under the real sub-path. |
| `npm run lint` | ESLint across the project (no warnings tolerated). |
| `npm run imagens` | Generate any missing AVIF/WebP variants and refresh the manifest. |
| `npm run imagens:forcar` | Regenerate every variant, including existing ones. |
| `npm run conferir-arquivos` | Report paths listed in `especies.json` but missing from `public/`. |
| `npm run extrair-ocorrencias` | Re-extract `ocorrencias.json` from the legacy folium map. |
| `npm run deploy` | Publish `dist/` to GitHub Pages (via `gh-pages`). |

> **About `prebuild`:** it runs `scripts/otimizar-imagens.mjs`, converting the
> 247 originals in `public/images/` into 924 AVIF/WebP variants. The variants are
> not committed (55 MB), so the **first** build after cloning takes ~6 min;
> later ones skip what already exists and cost 0.2 s.

---

## 🌐 Deployment (GitHub Pages)

The project is published on **GitHub Pages**. The `base` in `vite.config.js` is set to `"/Amazon_Aquabio/"` and
routing uses `HashRouter`, ensuring routes work on static hosting.

```bash
npm run build    # generates the dist/ folder
npm run deploy   # publishes dist/ to the gh-pages branch
```

🔗 Live application: **https://julio-csilva.github.io/Amazon_Aquabio/**

> ℹ️ If you *fork* it to another account/repository, update the `base` in `vite.config.js` and the URL above.

---

## 🧪 Methodology (pipeline)

The bioinformatics pipeline shown in the **Methodology** section of the site follows five steps:

1. **Sample selection** — species chosen by endemism, economic/evolutionary relevance and low mitogenomic
   representation in NCBI (at least 3 datasets per species, WGS Illumina *paired-end*).
2. **Mitogenome assembly** — [Mitomine](https://github.com/gleisonm/mitomine) pipeline with **NOVOPlasty v4.3**
   (seed *Pygocentrus nattereri*, `NC_015840.1`), **Unicycler v0.5.0**, **BWA v0.7.12** and cross-validation with **BLAST v2.16**.
3. **Genome annotation** — dual annotation with **MitoAnnotator / MitoFish v4.03** and **MITOS2 v2.1.9** (vertebrate genetic code, RefSeq63 Metazoa).
4. **Analysis & regulatory region** — PCGs, tRNAs, rRNAs and D-loop; alignments with **MAFFT v7**, tRNA structures with **tRNAscan-SE v2.0** + **R2DT v24**, repeats with **Tandem Repeats Finder v4.10.0**.
5. **Validation & quality control** — heteroplasmy/NUMT detection with **NOVOPlasty v4.3.1**, RSCU with **CaiCal v1.4** + Python, verification of the 37 genes (13 PCGs, 22 tRNAs, 2 rRNAs) and Spearman correlation in **R v4.4.1**.

---

## 🧭 Site sections

In page order. The `id`s are the ones in
[`src/app/secoes.js`](src/app/secoes.js), which drives both the menu and the
scroll-spy.

| `id` | Section | Description |
|------|---------|-------------|
| `apresentacao` | Hero | Depth parallax intro. |
| `mitogenoma` | What the mitochondrial genome is | Circular SVG map drawn from `sintenia.json`: 37 genes at their real positions, with strand and control region. |
| `estatisticas` | Numbers | Counters + infinite marquee of the 34 species. |
| `mapa` | Map | 1,136 occurrence points in Leaflet, with per-species highlighting. |
| `metodologia` | Methodology | Pinned scene: the section holds the screen and scrolling walks the 5 steps. Each has its own crop of the flowchart, with the rest of the diagram veiled; after the fifth, the page scrolls on. |
| `galeria` | Samples | Filterable grid; the card grows into a full-screen detail. |
| `comparador` | Comparison | SRA selection with a floating island; opens the comparison in a new tab. |
| `pesquisadores` | Researchers | The team (Lattes / LinkedIn / ORCID). |

> The old `B1`–`B8` folder numbering is gone: it recorded creation order, not
> content — and no longer matched the page (the `publicacoes` key pointed at the
> Comparison section).

---

## 🌍 Internationalization (PT / EN)

All interface copy lives in [`src/i18n/pt.js`](src/i18n/pt.js) and
[`src/i18n/en.js`](src/i18n/en.js), read through `t("dotted.key")` — previously
each component carried its own `texts = { pt, en }`, duplicated ~15 times.

The provider detects the browser language on a first visit (Portuguese if the
browser is set to Portuguese, English otherwise), stores the choice in
`localStorage` and keeps `<html lang>` current.

In development it compares the two dictionaries and logs whatever is missing
from either. Not part of i18n: the methodology descriptions (they are JSX, in
`src/data/metodologia.jsx`), the biographies (`src/data/pesquisadores.js`) and
the Plotly figure labels (coupled to each figure's code). Dataset fields stay
bilingual in the data itself (`nome`/`nome_en`, `descricao`/`descricao_en`).

---

## 👥 Team

Developed by the **BioME — Bioinformatics Multidisciplinary Environment** group at the
**Digital Metropolis Institute (IMD)**, **Federal University of Rio Grande do Norte (UFRN)**.

The full list of researchers, with links to Lattes, LinkedIn and ORCID, is available in the
**Researchers** section of the application.

---

## 📨 Contact

**Jorge Estefano Santana de Souza** *(corresponding author)*
Bioinformatics Multidisciplinary Environment (BioME) — Digital Metropolis Institute, UFRN — Natal/RN, Brazil
✉️ jorge@imd.ufrn.br

You can also use the contact form available within the application.

---

## 📄 License

- **Source code:** licensed under the **[MIT License](LICENSE)** — free to use, copy, modify and redistribute, keeping the copyright notice.
- **Species images:** made available under **[CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/)**, with proper attribution to their respective authors (the `by` field in the dataset).

---

<div align="center">

Made with 💙 by the **BioME / IMD-UFRN** group

</div>
