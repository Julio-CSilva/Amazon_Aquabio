/**
 * Acesso ao acervo de espécies (`data/especies.json`).
 *
 * As chaves do JSON continuam em português e no formato que o pipeline em
 * Python grava (`especie`, `nome`, `nome_en`, `amostras`, `redlist_status`).
 * Renomeá-las quebraria o contrato com `pipeline/build_*.py`, então a tradução
 * para o vocabulário da interface acontece aqui, e só aqui.
 */

/**
 * Nome popular no idioma corrente.
 *
 * Cai para o outro idioma quando um dos dois está vazio: melhor mostrar o nome
 * em inglês do que um espaço em branco. Quando os dois faltam, quem chama decide
 * o que exibir.
 */
export function nomeComum(especie, idioma) {
    const preferido = idioma === "en" ? especie.nome_en : especie.nome;
    const alternativo = idioma === "en" ? especie.nome : especie.nome_en;
    return preferido?.trim() || alternativo?.trim() || "";
}

/** Descrição no idioma corrente, com a mesma queda de fallback. */
export function descricao(especie, idioma) {
    const preferido = idioma === "en" ? especie.descricao_en : especie.descricao;
    return preferido?.trim() || especie.descricao?.trim() || "";
}

/**
 * Nome de quem fotografou, a partir do campo `by`.
 *
 * O acervo guarda o crédito no formato `by(Sobrenome_Nome)`, às vezes com
 * detalhes de licença colados: `by(tanya_dewey-animal-diversity_web-cc_by_nc_sa_3.0)`.
 * Esta função tira o invólucro e devolve algo legível — mas de propósito NÃO
 * tenta interpretar o miolo: as fotos são CC BY-NC-SA e o crédito precisa
 * chegar a quem tirou, então preservar o texto é mais importante que embelezá-lo.
 */
export function autorDaFoto(by) {
    if (!by) return "";
    const dentro = /^by\((.*)\)$/.exec(String(by).trim());
    return (dentro ? dentro[1] : String(by)).replace(/_/g, " ").trim();
}

/** Todos os SRAs de uma espécie. */
export function srasDe(especie) {
    return (especie.amostras ?? []).map((amostra) => amostra.sra);
}

/**
 * Filtra o acervo por texto livre e status da IUCN.
 *
 * A busca cobre nome popular (nos dois idiomas), nome científico e acessão SRA —
 * é comum chegar aqui com um `ERR…` copiado de um artigo, e não com o nome do
 * peixe.
 */
export function filtrarEspecies(especies, { busca = "", status = "" } = {}) {
    const termo = busca.trim().toLowerCase();

    return especies.filter((especie) => {
        if (status && especie.redlist_status !== status) return false;
        if (!termo) return true;

        const campos = [
            especie.especie,
            especie.nome,
            especie.nome_en,
            ...srasDe(especie),
        ];
        return campos.some((campo) => campo?.toLowerCase().includes(termo));
    });
}

/** Os status da IUCN presentes no acervo, na ordem canônica dada. */
export function statusPresentes(especies, ordem) {
    const encontrados = new Set(especies.map((e) => e.redlist_status).filter(Boolean));
    return ordem.filter((codigo) => encontrados.has(codigo));
}
