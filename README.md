<div align="center">

<img src="public/images/amazon-com-fundo-branco.png" alt="Logo Amazon Aquabio" width="420" />

# Amazon Aquabio

**Plataforma web para exploração da diversidade mitogenômica de peixes amazônicos.**

🌐 **[Acessar a aplicação](https://julio-csilva.github.io/Amazon_Aquabio/)**

🇧🇷 Português &nbsp;|&nbsp; 🇬🇧 [English](README.en.md)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra_UI-2-319795?logo=chakraui&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222?logo=github&logoColor=white)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20634179.svg)](https://doi.org/10.5281/zenodo.20634179)
![License: MIT](https://img.shields.io/badge/C%C3%B3digo-MIT-green)
![Imagens](https://img.shields.io/badge/Imagens-CC_BY--NC--SA-blue)

</div>

---

## 📖 Sobre

**Amazon Aquabio** é uma *single-page application* (SPA) bilíngue (Português / Inglês) que apresenta os
resultados de um estudo de **mitogenômica de peixes da Amazônia**. A partir de *data mining* em repositórios
públicos do **NCBI**, o projeto reconstruiu **100 mitogenomas de 34 espécies** de peixes amazônicos e
disponibiliza, de forma interativa:

- a galeria de espécies com seus dados de conservação (IUCN Red List);
- as análises de cada amostra — **sintenia, RSCU e repetições em tandem da D-loop são interativas**, calculadas a partir dos dados publicados no próprio site; mitogenoma circularizado e tRNA seguem como imagem;
- uma **ferramenta de comparação** lado a lado entre amostras selecionadas;
- a metodologia completa do pipeline bioinformático;
- o mapa de distribuição das espécies na bacia amazônica;
- a equipe de pesquisadores e um canal de contato.

O projeto é mantido pelo grupo **BioME (Bioinformatics Multidisciplinary Environment)** do
**Instituto Metrópole Digital (IMD/UFRN)**.

---

## ✨ Funcionalidades

- 🌍 **Bilíngue (PT-BR / EN)** — alternância de idioma em tempo real via React Context.
- 🐟 **Galeria de espécies** — busca por nome comum, nome científico ou código SRA, com filtro por status da IUCN Red List.
- 🔬 **Modal de detalhes** — ficha de cada espécie com descrição, licença de imagem, abas por amostra e carrossel das análises, com *zoom* e download de FASTA / NCBI / Genes FASTA.
- 🧪 **Ferramenta de comparação** — seleção de múltiplas amostras (SRAs) e visualização comparativa em nova aba.
- 🗺️ **Mapa interativo** — distribuição das 34 espécies na bacia amazônica (mapa embutido).
- 📚 **Metodologia interativa** — cards por etapa do pipeline, com diagrama e regiões destacadas em modal.
- 👥 **Carrossel de pesquisadores** — com links para Lattes, LinkedIn e ORCID.
- 📨 **Formulário de contato** — envio de mensagens via [EmailJS](https://www.emailjs.com/) + mapa de localização institucional.
- 📱 **Responsivo** — layout adaptado para *desktop* e *mobile* (menu *drawer*, grids fluidos).

---

## 🧬 O estudo (resumo)

| Item | Valor |
|------|-------|
| Espécies analisadas | **34** |
| Mitogenomas reconstruídos | **100** |
| Família predominante | *Cichlidae* |
| Fonte dos dados | Repositórios públicos do **NCBI / SRA** (destaque para o projeto `PRJEB48774` — Sanger Institute) |
| Mitogenoma semente | *Pygocentrus nattereri* (`NC_015840.1`) |
| Tecnologia de sequenciamento | Illumina *paired-end* (WGS) |

---

## 🛠️ Tecnologias

| Categoria | Ferramentas |
|-----------|-------------|
| **Core** | [React 18](https://react.dev/), [Vite 6](https://vitejs.dev/) |
| **Roteamento** | [React Router 7](https://reactrouter.com/) (`createHashRouter`, rotas *lazy*) |
| **UI / Estilo** | [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) sobre [Radix](https://www.radix-ui.com/) |
| **Animação** | [Motion](https://motion.dev/) (gestos, layout, `AnimatePresence`), [GSAP + ScrollTrigger](https://gsap.com/) (cenas dirigidas pela rolagem: tinta de seção, traçado do mitogenoma, pin da metodologia, fita de sequência, réguas dos títulos) |
| **Gráficos** | [Plotly.js](https://plotly.com/javascript/) (bundle `cartesian`, carregado sob demanda) |
| **Mapa** | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/), ladrilhos do OpenStreetMap |
| **Tipografia** | Space Grotesk · Inter · JetBrains Mono, via [Fontsource](https://fontsource.org/) (variáveis, `woff2`) |
| **Imagens** | [sharp](https://sharp.pixelplumbing.com/) gerando AVIF/WebP em várias larguras |
| **Ícones** | [lucide-react](https://lucide.dev/) (interface) e [react-icons](https://react-icons.github.io/react-icons/) (marcas) |
| **Formulário** | [@emailjs/browser](https://www.emailjs.com/) |
| **Qualidade / Deploy** | [ESLint 9](https://eslint.org/) (config plana), [gh-pages](https://github.com/tschaub/gh-pages) |

---

### 🎨 De onde vem a paleta

As cores não foram inventadas na refatoração: são as do site anterior,
recuperadas do código e promovidas a escalas completas em
[`src/styles/tokens.css`](src/styles/tokens.css).

| Âncora | Origem no site antigo | Virou |
|---|---|---|
| `#365B6D` | a cor mais usada (20 ocorrências): faixas de seção, cabeçalho | escala **ardósia** — superfícies |
| `#037373` | acento (13×): legendas da galeria, botões dos gráficos | escala **river** — primária |
| `#5A7302` | a faixa da galeria | escala **oliva** — acento de seção |
| `#B2EBF2` | hover do menu, comentado como "tom aquático suave" | escala **aqua** — bioluminescência |
| `#061721` · `#080412` | fim do gradiente de fundo | escala **abismo** — fundo |

O gradiente de profundidade preserva as quatro paradas do original
(`0% / 20% / 80% / 100%`), que é o que dá a leitura de mergulho — a luz da
superfície some rápido e o fundo é longo.

O site antigo também alternava a cor de fundo **por seção**. Isso não sumiu:
virou atmosfera. `TintaDeSecao` faz a aurora do fundo assumir a cor da seção que
está sendo lida, com a travessia acontecendo durante a rolagem — o oliva da
galeria continua lá.

Todos os pares texto/fundo dos dois temas passam WCAG AA (≥ 4.5:1).

---

## 📂 Estrutura do projeto

Nomes de pastas estruturais em inglês (convenção React); **termos de domínio
permanecem em português**, porque as chaves dos JSON gerados pelo `pipeline/`
são PT (`especie`, `amostras`, `comprimento`, `rotulos`) e renomeá-las quebraria
o contrato com os scripts Python.

```
Amazon_Aquabio/
├── index.html                  # HTML raiz (meta, OG, favicons, manifest)
├── vite.config.js              # base "/Amazon_Aquabio/", alias @/, chunk do Plotly
├── eslint.config.js            # ESLint 9, config plana
├── components.json             # shadcn/ui (registries do Cult UI e Skiper UI)
├── .env.example                # chaves do EmailJS (copie para .env.local)
├── scripts/
│   ├── otimizar-imagens.mjs    # PNG/JPG -> AVIF/WebP + manifesto (roda no prebuild)
│   ├── fluxograma-metodologia.mjs # exports do draw.io -> as 5 imagens de etapa (alinhadas + véu)
│   ├── extrair-ocorrencias.mjs # mapa_peixes.html -> data/ocorrencias.json
│   └── conferir-arquivos.mjs   # acusa caminhos citados em especies.json e ausentes
├── public/
│   ├── data/                   # 📊 buscado em tempo de execução
│   │   ├── sintenia.json       #   ordem e coordenadas gênicas, 100 amostras
│   │   ├── rscu.json           #   RSCU por amostra + consensos por grupo
│   │   ├── tandem_repeats.json #   repetições da região controle, 32 espécies
│   │   ├── ocorrencias.json    #   1136 pontos de ocorrência, 30 espécies
│   │   └── atribuicoes.json    #   comprovantes de licença (fora do bundle JS)
│   ├── images/                 # originais + variantes AVIF/WebP (estas, ignoradas no git)
│   └── docs/b8/                # FASTA, genes e metadados NCBI para download
├── pipeline/                   # ⚙️ geração dos JSON de análise (Python, stdlib)
└── src/
    ├── main.jsx                # entry: Providers + RouterProvider
    ├── app/                    # router, Layout, providers, secoes.js
    ├── styles/
    │   ├── tokens.css          # 🎨 fonte ÚNICA de cor e tipografia ("Águas Escuras")
    │   └── globals.css         # base do documento, utilitários, movimento reduzido
    ├── i18n/                   # pt.js · en.js · provider · contexto
    ├── theme/                  # alternância claro/escuro
    ├── lib/                    # utils · assets · iucn · especies · format · atribuicoes
    ├── hooks/                  # useScrollSpy · useReducedMotion
    ├── data/                   # especies.json · pesquisadores · metodologia · imagens.json
    ├── components/
    │   ├── ui/                 #   primitivos shadcn + <Figura>
    │   ├── motion/             #   Reveal · Marquee · Contador · Caustics
    │   └── layout/             #   Header · Footer · alternadores
    ├── features/
    │   ├── hero/               #   parallax de profundidade
    │   ├── mitogenome/         #   🧬 mapa circular SVG a partir de sintenia.json
    │   ├── stats/              #   contadores + faixa infinita de espécies
    │   ├── map/                #   mapa React (Leaflet), carregado sob demanda
    │   ├── methodology/        #   cena com pin (GSAP ScrollTrigger)
    │   ├── gallery/            #   grade filtrável + detalhe em tela cheia
    │   ├── comparator/         #   seleção de SRAs + ilha flutuante
    │   ├── researchers/        #   equipe
    │   └── analises/           #   📈 figuras Plotly (superfície de papel)
    └── pages/                  # HomePage · ContactPage · ComparisonPage · NotFoundPage
```

---

## 📈 Análises interativas

Sintenia, RSCU e repetições em tandem da região controle deixaram de ser PNG e
passaram a ser desenhadas no navegador a partir de dados versionados em
`public/data/`. O que isso muda:

- **Comparar virou uma figura só.** No comparador, as amostras selecionadas
  entram no mesmo eixo em vez de virarem N imagens empilhadas.
- **Cada valor é auditável.** Sintenia e RSCU são calculados dos `_genes.fa`
  que o site distribui: baixe o arquivo, rode `pipeline/build_rscu.py` e você
  chega ao mesmo número da tela.
- **O site ficou mais leve.** Os três JSON somam ~170 KB, contra os 14 MB de
  PNG que substituíram, e o Plotly (~477 KB gzip) só é baixado por quem abre
  uma análise.

Para regerar os dados:

```bash
python3 pipeline/build_all.py --validar
```

Detalhes de convenção, ressalvas de qualidade e uma divergência encontrada no
RSCU publicado estão em [`pipeline/README.md`](pipeline/README.md).

---

## 🗂️ Modelo de dados

O conteúdo é orientado por dados, definido em [`src/fotos.json`](src/fotos.json). Cada **espécie** contém uma
lista de **amostras** (`amostras`), e cada amostra referencia as imagens e arquivos gerados pelo pipeline.

```jsonc
{
  "especie": "Acarichthys heckelii",   // nome científico
  "nome": "Ciclídeo cabeça de ouro",   // nome comum (PT)
  "nome_en": "Threadfin acara",        // nome comum (EN)
  "path": "images/b3/Acarichthys_heckelii_by(Nilsson_Kjell).jpg",
  "by": "by(Nilsson_Kjell)",           // atribuição da imagem
  "descricao": "...",                  // descrição (PT)
  "descricao_en": "...",               // descrição (EN)
  "redlist_status": "LC",              // status IUCN: NE, DD, LC, NT, VU, EN, CR, EW, EX
  "id": 0,
  "tagId": 2,
  "amostras": [
    {
      "id": 1,
      "sra": "ERR10768189",            // código de acesso NCBI SRA
      "path_mito_circularized": "images/b8/circularized/...png",
      "path_trna":              "images/b8/trna/...png",
      "path_circos":            "images/b8/circos/...png",
      "path_coverage":          "images/b8/coverage/...png",
      "path_fasta":             "docs/b8/fasta/...fa",       // download: mitogenoma
      "path_gensFasta":         "docs/b8/gens_fasta/...fa",  // download: genes
      "path_NCBI":              "docs/b8/NCBI/...txt"         // download: metadados
    }
  ]
}
```

> 📌 **Para adicionar uma espécie/amostra:** insira o objeto em `src/fotos.json` e coloque as imagens/arquivos
> correspondentes nas pastas de `public/images/b8/...` e `public/docs/b8/...`, mantendo o padrão de nomes dos `path_*`.

O arquivo [`src/by_links.json`](src/by_links.json) guarda as imagens de atribuição (em *base64*), associadas a
cada espécie pelo `id`.

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) **20+** (recomendado LTS)
- npm (acompanha o Node) ou outro gerenciador de pacotes

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Julio-CSilva/Amazon_Aquabio.git
cd Amazon_Aquabio

# 2. Instale as dependências
npm install

# 3. (Opcional) Configure o formulário de contato
cp .env.example .env.local   # e preencha as chaves do EmailJS

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação fica em **http://localhost:5173/Amazon_Aquabio/** — o caminho vem do
`base` em `vite.config.js`, que existe porque o site é servido de um subcaminho
do GitHub Pages.

> Sem `.env.local`, tudo funciona: o formulário de contato renderiza e avisa que
> o envio não está configurado, em vez de falhar em silêncio.

> A **primeira** `npm run build` gera as variantes de imagem (~6 min, uma vez
> só). Para adiantar isso a qualquer momento: `npm run imagens`.

---

## 📜 Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite + HMR). |
| `npm run build` | *Build* de produção em `dist/`. Dispara `prebuild` antes. |
| `npm run preview` | Pré-visualiza a *build* localmente, no subcaminho real. |
| `npm run lint` | ESLint em todo o projeto (zero avisos tolerados). |
| `npm run imagens` | Gera as variantes AVIF/WebP que faltam e atualiza o manifesto. |
| `npm run imagens:forcar` | Regera todas as variantes, mesmo as existentes. |
| `npm run conferir-arquivos` | Acusa caminhos citados em `especies.json` e ausentes em `public/`. |
| `npm run extrair-ocorrencias` | Reextrai `ocorrencias.json` do mapa antigo do folium. |
| `npm run deploy` | Publica `dist/` no GitHub Pages (via `gh-pages`). |

> **Sobre o `prebuild`:** ele roda `scripts/otimizar-imagens.mjs`, que converte
> os 247 originais de `public/images/` em 924 variantes AVIF/WebP. As variantes
> não são versionadas (55 MB), então a **primeira** *build* após clonar leva
> ~6 min; as seguintes pulam o que já existe e custam 0,2 s.

---

## 🌐 Deploy (GitHub Pages)

O projeto é publicado no **GitHub Pages**. O `base` em `vite.config.js` está definido como `"/Amazon_Aquabio/"` e
o roteamento usa `HashRouter`, garantindo o funcionamento das rotas em hospedagem estática.

```bash
npm run build    # gera a pasta dist/
npm run deploy   # publica dist/ na branch gh-pages
```

🔗 Aplicação publicada: **https://julio-csilva.github.io/Amazon_Aquabio/**

> ℹ️ Caso faça *fork* para outra conta/repositório, ajuste o `base` em `vite.config.js` e a URL acima.

---

## 🧪 Metodologia (pipeline)

O pipeline bioinformático apresentado na seção **Metodologia** do site segue cinco etapas:

1. **Seleção da amostra** — espécies escolhidas por endemicidade, relevância econômica/evolutiva e baixa
   representatividade mitogenômica no NCBI (mínimo de 3 conjuntos de dados por espécie, WGS Illumina *paired-end*).
2. **Montagem dos mitogenomas** — pipeline [Mitomine](https://github.com/gleisonm/mitomine) com **NOVOPlasty v4.3**
   (semente *Pygocentrus nattereri*, `NC_015840.1`), **Unicycler v0.5.0**, **BWA v0.7.12** e validação cruzada com **BLAST v2.16**.
3. **Anotação genômica** — anotação dupla com **MitoAnnotator / MitoFish v4.03** e **MITOS2 v2.1.9** (código genético de vertebrados, RefSeq63 Metazoa).
4. **Análises e região reguladora** — PCGs, tRNAs, rRNAs e D-loop; alinhamentos com **MAFFT v7**, estruturas de tRNA com **tRNAscan-SE v2.0** + **R2DT v24**, repetições com **Tandem Repeats Finder v4.10.0**.
5. **Validação e controle de qualidade** — detecção de heteroplasmia/NUMTs com **NOVOPlasty v4.3.1**, RSCU com **CaiCal v1.4** + Python, verificação dos 37 genes (13 PCGs, 22 tRNAs, 2 rRNAs) e correlação de Spearman em **R v4.4.1**.

---

## 🧭 Seções do site

Na ordem em que aparecem. Os `id` são os mesmos de
[`src/app/secoes.js`](src/app/secoes.js), que alimenta o menu e o *scroll-spy*.

| `id` | Seção | Descrição |
|------|-------|-----------|
| `apresentacao` | Apresentação | Hero com parallax de profundidade. |
| `mitogenoma` | O que é o genoma mitocondrial | Mapa circular SVG desenhado a partir de `sintenia.json`: 37 genes com posição real, fita e região controle. |
| `estatisticas` | Números | Contadores + faixa infinita das 34 espécies. |
| `mapa` | Mapa | 1136 pontos de ocorrência em Leaflet, com realce por espécie. |
| `metodologia` | Metodologia | Cena com *pin*: a seção prende a tela e a rolagem percorre as 5 etapas. Cada uma tem o seu recorte do fluxograma, com o resto do diagrama sob um véu; ao fim da quinta a página volta a rolar. |
| `galeria` | Amostras | Grade filtrável; o cartão cresce até o detalhe em tela cheia. |
| `comparador` | Comparador | Seleção de SRAs com ilha flutuante; abre a comparação em nova aba. |
| `pesquisadores` | Pesquisadores | A equipe (Lattes / LinkedIn / ORCID). |

> A numeração `B1`–`B8` das pastas antigas foi aposentada: ela dizia a ordem de
> criação, não o conteúdo — e já não batia com a ordem da página (a chave
> `publicacoes` apontava para o Comparador).

---

## 🌍 Internacionalização (PT / EN)

Todo o texto de interface vive em [`src/i18n/pt.js`](src/i18n/pt.js) e
[`src/i18n/en.js`](src/i18n/en.js), acessado por `t("chave.pontuada")` — antes
cada componente carregava seu próprio `texts = { pt, en }`, duplicado ~15 vezes.

O provider detecta o idioma do navegador na primeira visita (português se o
navegador estiver em português, inglês caso contrário), guarda a escolha em
`localStorage` e mantém `<html lang>` em dia.

Em desenvolvimento, o provider compara as chaves dos dois dicionários e avisa no
console o que faltar em cada um. Não entram no i18n: as descrições da
metodologia (são JSX, em `src/data/metodologia.jsx`), as biografias
(`src/data/pesquisadores.js`) e os rótulos das figuras Plotly (acoplados ao
código de cada figura). Os campos do dataset seguem bilíngues no próprio dado
(`nome`/`nome_en`, `descricao`/`descricao_en`).

---

## 👥 Equipe

Projeto desenvolvido pelo grupo **BioME — Bioinformatics Multidisciplinary Environment**, do
**Instituto Metrópole Digital (IMD)**, **Universidade Federal do Rio Grande do Norte (UFRN)**.

A lista completa de pesquisadores, com links para Lattes, LinkedIn e ORCID, está disponível na seção
**Pesquisadores** da aplicação.

---

## 📨 Contato

**Jorge Estefano Santana de Souza** *(autor correspondente)*
Bioinformatics Multidisciplinary Environment (BioME) — Instituto Metrópole Digital, UFRN — Natal/RN, Brasil
✉️ jorge@imd.ufrn.br

Ou utilize o formulário de contato disponível na própria aplicação.

---

## 📄 Licença

- **Código-fonte:** licenciado sob a **[Licença MIT](LICENSE)** — uso, cópia, modificação e redistribuição livres, mantendo o aviso de copyright.
- **Imagens das espécies:** disponibilizadas sob **[CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/)**, com a devida atribuição aos respectivos autores (campo `by` no dataset).

---

<div align="center">

Feito com 💙 pelo grupo **BioME / IMD-UFRN**

</div>
