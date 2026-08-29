/**
 * Imagens de atribuição das fotos do acervo.
 *
 * São capturas de tela da página de origem de cada foto, guardadas como data
 * URL base64. Servem de comprovante da licença CC BY-NC-SA — por isso existem, e
 * por isso não podem simplesmente sumir.
 *
 * O arquivo saiu de `src/by_links.json` para `public/data/atribuicoes.json`.
 * Como estava em `src/`, os 320 KB de base64 eram importados pelo módulo da
 * galeria e entravam no bundle JavaScript: toda visita baixava 34 capturas de
 * licença, mesmo quem nunca clicasse em nenhuma. Agora são buscadas no primeiro
 * clique e ficam em cache pelo resto da sessão.
 */

const URL_DADOS = `${import.meta.env.BASE_URL}data/atribuicoes.json`;

let promessa = null;

/** Busca o índice de atribuições uma vez por sessão. */
function carregar() {
    if (!promessa) {
        promessa = fetch(URL_DADOS)
            .then((resposta) => {
                if (!resposta.ok) throw new Error(`atribuicoes.json: ${resposta.status}`);
                return resposta.json();
            })
            .catch((erro) => {
                // Uma falha não pode ficar em cache: o próximo clique precisa
                // poder tentar de novo.
                promessa = null;
                throw erro;
            });
    }
    return promessa;
}

/**
 * Abre a atribuição de uma espécie numa aba nova.
 *
 * Converte a data URL em Blob antes de abrir. `window.open` direto numa data URL
 * é bloqueado pelos navegadores desde que passaram a tratá-la como navegação de
 * origem opaca — o Blob tem origem própria e abre normalmente.
 *
 * @param {number} id O `id` da espécie em `especies.json`.
 */
export async function abrirAtribuicao(id) {
    const entradas = await carregar();
    const entrada = entradas.find((item) => item.id === id);
    if (!entrada?.links) return false;

    const [cabecalho, base64] = entrada.links.split(",");
    const mime = /data:(.*);base64/.exec(cabecalho)?.[1] ?? "image/jpeg";

    const binario = atob(base64);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i += 1) {
        bytes[i] = binario.charCodeAt(i);
    }

    const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    window.open(url, "_blank", "noopener");
    // Sem isto, cada abertura vaza um Blob pelo resto da sessão. O atraso dá
    // tempo da aba nova ler a URL antes de ela ser invalidada.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return true;
}
