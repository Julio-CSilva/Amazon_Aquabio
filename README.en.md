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

| Category | Tools |
|----------|-------|
| **Core** | [React 18](https://react.dev/), [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router 6](https://reactrouter.com/) (`createHashRouter`) |
| **UI / Styling** | [Chakra UI](https://chakra-ui.com/), [styled-components](https://styled-components.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Charts** | [Plotly.js](https://plotly.com/javascript/) (`cartesian` bundle, lazy-loaded) |
| **Carousels / Zoom** | [Swiper](https://swiperjs.com/), [react-slick](https://react-slick.neostack.com/), [keen-slider](https://keen-slider.io/), [react-medium-image-zoom](https://github.com/rpearce/react-medium-image-zoom) |
| **Icons / UX** | [react-icons](https://react-icons.github.io/react-icons/), [react-countup](https://github.com/glennreyes/react-countup), [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) |
| **Form** | [@emailjs/browser](https://www.emailjs.com/) |
| **Quality / Deploy** | [ESLint](https://eslint.org/), [gh-pages](https://github.com/tschaub/gh-pages) |

---

## 📂 Project structure

```
Amazon_Aquabio/
├── index.html                  # Root HTML (favicons, manifest, #root)
├── vite.config.js              # Vite config (base: "/Amazon_Aquabio/")
├── package.json                # Dependencies and scripts
├── public/                     # Static assets served as-is
│   ├── mapa_peixes.html        # Interactive Amazon basin map (iframe)
│   ├── images/                 # Images (b2..b8, logos, fish, patterns)
│   │   └── b8/                 # Per-sample generated analyses:
│   │       ├── circularized/   #   circularized mitogenome
│   │       ├── trna/           #   tRNA structure
│   │       ├── circos/         #   Circos plot
│   │       └── coverage/       #   coverage analysis
│   ├── data/                   # 📊 Interactive analysis data (generated)
│   │   ├── sintenia.json       #   gene order and coordinates, 100 samples
│   │   ├── rscu.json           #   per-sample RSCU + per-group consensus
│   │   └── tandem_repeats.json #   control region repeats, 32 species
│   ├── docs/b8/                # Downloadable files
│   │   ├── fasta/              #   mitogenomes (.fa)
│   │   ├── gens_fasta/         #   genes (.fa)
│   │   └── NCBI/               #   NCBI metadata (.txt)
│   ├── icons/                  # Icons and favicons
│   └── Fonts/                  # Custom fonts
├── pipeline/                   # ⚙️ Analysis JSON generation (Python, stdlib)
│   ├── build_all.py            #   runs the three builds
│   ├── build_sintenia.py       #   *_genes.fa  -> sintenia.json
│   ├── build_rscu.py           #   *_genes.fa  -> rscu.json
│   ├── build_tandem_repeats.py #   tsv_tr/     -> tandem_repeats.json
│   ├── vendor/                 #   sintenia_io / sintenia_theme (marked copy)
│   └── dados_entrada/          #   TRF TSVs and RSCU consensus tables
└── src/
    ├── main.jsx                # Entry point: HashRouter + ChakraProvider + theme
    ├── App.jsx                 # Layout: fixed header, background, footer, LanguageProvider
    ├── theme.js                # Chakra UI theme (fonts)
    ├── fotos.json              # 🗄️ Main dataset (34 species / 100 samples)
    ├── by_links.json           # Attribution images (base64) per species
    ├── routes/
    │   ├── home.jsx            # Home page (assembles sections B1..B8)
    │   ├── contato.jsx         # Contact page (EmailJS + map)
    │   └── error-page.jsx      # Route error page
    ├── analises/               # 📈 Interactive analyses (Plotly, on demand)
    │   ├── SinteniaPlot.jsx    #   position · gene order · length per gene
    │   ├── RscuPlot.jsx        #   stacked · heatmap · bars per codon
    │   ├── TandemRepeatsPlot.jsx#  control region map · copies × span
    │   ├── AbasDaAmostra.jsx   #   the 5 analyses of one sample, as tabs
    │   ├── dados.js            #   fetch and cache of public/data/ JSON
    │   └── tema.js             #   shared ink and layout for the figures
    ├── componentes/            # Shared components
    │   ├── Cabecalho/          #   Fixed header + navigation + language toggle
    │   ├── Footer/             #   Footer
    │   ├── LanguageContext/    #   Internationalization context (PT/EN)
    │   ├── ModalZoom/          #   Species detail modal
    │   ├── ButtonPersonalizado/#   Custom navigation button
    │   └── EstilosGlobais/     #   Global styles
    ├── Home/                   # Home page sections (blocks B1..B8)
    │   ├── B1_Apresentacao/    #   Hero / intro
    │   ├── B2_Definicao/       #   "What is the mitochondrial genome?"
    │   ├── B3_Peixes/          #   Species highlight
    │   ├── B4_Mapa/            #   Distribution map
    │   ├── B5_Metodologia/     #   Pipeline (cards + modal)
    │   ├── B6_Comparador/      #   Comparison tool + viewer
    │   ├── B7_Pesquisadores/   #   Team carousel
    │   ├── B8_Galeria/         #   Gallery + filters
    │   └── BX_Publicações/     #   Publications (reserved, not active)
    └── utils/
        └── iucnUtils.js        # Maps IUCN status → CSS gradient
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

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- npm (bundled with Node) or another package manager

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Julio-CSilva/Amazon_Aquabio.git
cd Amazon_Aquabio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will be available at **http://localhost:5173/Amazon_Aquabio/** (the `/Amazon_Aquabio/` path comes
from the `base` configured in `vite.config.js`).

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server (Vite + HMR). |
| `npm run build` | Generates the production build into `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint across the project. |
| `npm run deploy` | Publishes the `dist/` folder to GitHub Pages (via `gh-pages`). |

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

| Block | Section | Description |
|-------|---------|-------------|
| **B1** | Presentation | Hero with the project's purpose. |
| **B2** | Definition | What the mitochondrial genome is. |
| **B3** | Fish | Visual highlight of the species. |
| **B4** | Map | Species distribution across the Amazon basin. |
| **B5** | Methodology | Pipeline as interactive cards + diagram modal. |
| **B6** | Comparison tool | SRA selection and comparative visualization. |
| **B7** | Researchers | Team carousel (Lattes / LinkedIn / ORCID). |
| **B8** | Gallery | Species grid with search and IUCN filter. |

---

## 🌍 Internationalization (PT / EN)

Language switching is handled by a **React Context** ([`src/componentes/LanguageContext`](src/componentes/LanguageContext/index.jsx)).
The default language is **English (`en`)** and each component keeps its own texts in a `texts = { pt, en }` object.
The dataset content fields are bilingual as well (`nome`/`nome_en`, `descricao`/`descricao_en`).

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
