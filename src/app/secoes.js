/**
 * As seções da home, na ordem em que aparecem.
 *
 * Fonte única para três coisas que precisavam concordar e antes não concordavam:
 * o `id` da âncora na página, o rótulo no menu e a ordem do scroll-spy. Antes o
 * menu listava `publicacoes` e a seção correspondente renderizava o Comparador —
 * o rótulo dizia uma coisa, o destino era outra.
 *
 * `rotulo` é a chave em `i18n/*.js`, não o texto.
 */
/**
 * Cada seção carrega a própria tinta de ambiente.
 *
 * O site antigo alternava a cor de FUNDO por seção: ardósia (#365B6D) na
 * apresentação e na metodologia, branco no mitogenoma e no mapa, e um oliva
 * (#5A7302) inconfundível na galeria. Empilhar faixas de cor chapada não combina
 * com a página contínua de agora — mas jogar essa identidade fora empobreceria o
 * site.
 *
 * A solução é a tinta viajar com a rolagem: a aurora do fundo assume a cor da
 * seção que você está lendo, e a transição acontece enquanto você rola. O
 * repertório de cor é o mesmo de antes; o que mudou é que ele deixou de ser
 * faixa e virou atmosfera.
 */
export const SECOES = [
    { id: "apresentacao", rotulo: "nav.inicio", tinta: "#185843" },
    { id: "mitogenoma", rotulo: "nav.sobre", tinta: "#134d3b" },
    { id: "estatisticas", rotulo: null, tinta: "#0f3d2e" },
    { id: "mapa", rotulo: "nav.mapa", tinta: "#165440" },
    { id: "metodologia", rotulo: "nav.metodologia", tinta: "#144e3b" },
    { id: "galeria", rotulo: "nav.amostras", tinta: "#1e683b" },
    { id: "comparador", rotulo: "nav.comparador", tinta: "#185843" },
    { id: "pesquisadores", rotulo: "nav.pesquisadores", tinta: "#103f2f" },
];

/** Só as que aparecem no menu — `estatisticas` é seção, mas não item de nav. */
export const SECOES_DO_MENU = SECOES.filter((s) => s.rotulo);

export const IDS_SECOES = SECOES.map((s) => s.id);
