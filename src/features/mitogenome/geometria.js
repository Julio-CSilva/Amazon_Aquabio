/**
 * Geometria do mapa circular do mitogenoma.
 *
 * Funções puras, sem React: dá para conferir os números no console sem montar
 * nada. Toda a trigonometria fica aqui para o componente cuidar só de desenhar.
 *
 * ── Convenções ──
 *
 * O zero fica às 12 horas e o sentido é horário, como em toda figura publicada
 * de mitogenoma. Em coordenadas SVG o eixo Y cresce para baixo, então "horário
 * na tela" já é o sentido natural de somar ângulos — é por isso que não há
 * inversão de sinal aqui.
 *
 * Fita pesada (+1) vai no anel externo, fita leve (−1) no interno. É a
 * convenção que permite ler de relance que o ND6 e a maioria dos tRNAs estão na
 * outra fita.
 */

const GRAUS_POR_RADIANO = Math.PI / 180;

/** Ponto na circunferência, com 0° às 12 horas. */
export function polar(centro, raio, graus) {
    const radianos = (graus - 90) * GRAUS_POR_RADIANO;
    return {
        x: centro + raio * Math.cos(radianos),
        y: centro + raio * Math.sin(radianos),
    };
}

/**
 * Caminho SVG de um setor de anel (arco com espessura).
 *
 * Um arco de 360° não pode ser desenhado com um único comando `A`: o ponto
 * inicial e o final coincidem e o navegador não tem como saber por onde ir, e
 * simplesmente não desenha nada. Como nenhum gene chega perto de 360°, a
 * situação não aparece — mas a região controle de uma espécie sem outros dados
 * poderia, então o ângulo é limitado.
 */
export function setorAnel(centro, raioInterno, raioExterno, grausInicio, grausFim) {
    const varredura = Math.min(Math.abs(grausFim - grausInicio), 359.99);
    const fim = grausInicio + varredura;
    const maior = varredura > 180 ? 1 : 0;

    const externoInicio = polar(centro, raioExterno, grausInicio);
    const externoFim = polar(centro, raioExterno, fim);
    const internoFim = polar(centro, raioInterno, fim);
    const internoInicio = polar(centro, raioInterno, grausInicio);

    return [
        `M ${externoInicio.x} ${externoInicio.y}`,
        `A ${raioExterno} ${raioExterno} 0 ${maior} 1 ${externoFim.x} ${externoFim.y}`,
        `L ${internoFim.x} ${internoFim.y}`,
        `A ${raioInterno} ${raioInterno} 0 ${maior} 0 ${internoInicio.x} ${internoInicio.y}`,
        "Z",
    ].join(" ");
}

/**
 * Monta os segmentos de uma amostra a partir de `sintenia.json`.
 *
 * ── Por que a região controle entra por fora ──
 *
 * `sintenia.json` traz um aviso explícito em `meta.observacao`: as coordenadas
 * vêm dos arquivos `_genes.fa`, onde a região controle NÃO está anotada. Ou
 * seja, `amostra.comprimento` é o fim do último gene (trnP), não o tamanho do
 * mitogenoma — para o Pygocentrus, 15.666 pb em vez dos ~16.700 reais.
 *
 * Desenhar 0–15.666 como uma volta completa produziria um círculo bonito e
 * errado: sugeriria que os genes ocupam o genoma inteiro e apagaria justamente a
 * região que a análise de repetições em tandem estuda.
 *
 * O tamanho da região controle vem de `tandem_repeats.json` (`cr_pb`), que a
 * mede por espécie — 31 das 34 têm o valor. Para as outras três o arco aparece
 * assim mesmo, marcado como não medido e fora da soma em pares de base: o
 * espaço existe no genoma, e omiti-lo seria a mesma distorção ao contrário.
 *
 * @returns {{segmentos: Array, total: number, medido: boolean, controlePb: number|null}}
 */
export function montarSegmentos(dados, sra, controlePb, tema = "escuro") {
    const amostra = dados.amostras[sra];
    if (!amostra) return null;

    const genes = dados.ordens[amostra.ordem];
    const medido = Number.isFinite(controlePb) && controlePb > 0;

    // Sem medida, reserva-se uma fatia proporcional só para o arco existir. 900 pb
    // é a ordem de grandeza típica da região controle em peixes — usada apenas
    // como espaço visual, nunca somada ao total exibido.
    const controle = medido ? controlePb : 900;
    const total = amostra.comprimento + controle;

    const grau = (bp) => (bp / total) * 360;

    const segmentos = genes.map((gene, i) => {
        const [inicio, fim, fita] = amostra.coords[i];
        const classe = dados.gene_classe[gene] ?? "outro";
        return {
            chave: `${gene}-${i}`,
            gene,
            rotulo: dados.rotulos[gene] ?? gene,
            classe,
            classeRotulo: dados.classes[classe] ?? classe,
            cor: corDoGene(dados, gene, tema),
            fita,
            inicio,
            fim,
            tamanho: fim - inicio,
            grausInicio: grau(inicio),
            grausFim: grau(fim),
            divergente: amostra.divergentes?.includes(gene) ?? false,
        };
    });

    segmentos.push({
        chave: "controle",
        gene: "Dloop",
        rotulo: "D-loop",
        classe: "control",
        classeRotulo: dados.classes.control ?? "região controle",
        cor: corDoGene(dados, "Dloop", tema),
        fita: 1,
        inicio: amostra.comprimento,
        fim: amostra.comprimento + controle,
        tamanho: medido ? controle : null,
        grausInicio: grau(amostra.comprimento),
        grausFim: 360,
        divergente: false,
        controle: true,
        medido,
    });

    return {
        segmentos,
        total: medido ? total : amostra.comprimento,
        medido,
        controlePb: medido ? controlePb : null,
        comprimentoGenes: amostra.comprimento,
        especie: amostra.especie,
    };
}

/** Cor de um gene, com recuo para a cor da classe. Espelha `SinteniaPlot`. */
export function corDoGene(dados, gene, tema = "escuro") {
    const propria = dados.cores[gene];
    if (propria) return propria[tema];
    const classe = dados.gene_classe[gene] || "outro";
    return (dados.cores[`@${classe}`] || dados.cores["@outro"])[tema];
}

/**
 * As cores que REPRESENTAM uma classe na legenda.
 *
 * ── Por que isto existe ──
 *
 * A legenda pintava cada quadradinho com `cores["@" + classe]`. Só que
 * `sintenia.json` tem uma entrada de classe utilizável: `@trna`. `@pcg` sequer
 * é emitido — `build_sintenia.py` o omite de propósito, porque cada PCG tem cor
 * própria — e `@rrna` e `@control` caem na mesma cinza de `@outro`, que é o
 * recuo do gerador quando não há marca definida para a classe. Resultado: três
 * dos quatro quadradinhos saíam idênticos, e nenhum deles batia com o que está
 * desenhado no círculo ao lado.
 *
 * A saída não é inventar cores novas: a legenda passaria a prometer o que o
 * desenho não cumpre. É montar a legenda A PARTIR dos arcos — as cores que os
 * genes daquela classe já têm, na ordem do genoma.
 *
 * @returns {string[]} pelo menos uma cor, na ordem de `ordem_consenso`.
 */
export function coresDaClasse(dados, classe, tema = "escuro") {
    const recuo = () => [
        (dados.cores[`@${classe}`] ?? dados.cores["@outro"])?.[tema],
    ];

    // A região controle não está em `gene_classe`: o segmento é sintético,
    // montado aqui mesmo (ver `montarSegmentos`). A cor dela é a do `Dloop`.
    if (classe === "control") {
        return dados.cores.Dloop ? [dados.cores.Dloop[tema]] : recuo();
    }

    const proprias = [];
    for (const gene of dados.ordem_consenso ?? []) {
        if (dados.gene_classe[gene] !== classe) continue;
        const cor = dados.cores[gene]?.[tema];
        // `includes` e não um Set: são 37 genes e no máximo 13 cores. Manter o
        // array preserva a ordem do genoma, que é o que faz o degradê do PCG
        // percorrer as cores na mesma sequência em que elas aparecem no anel.
        if (cor && !proprias.includes(cor)) proprias.push(cor);
    }

    // Nenhum gene da classe tem cor própria — é o caso dos 22 tRNAs, todos
    // pintados pela cor de classe. Aí `@trna` é exatamente a resposta certa.
    return proprias.length > 0 ? proprias : recuo();
}
