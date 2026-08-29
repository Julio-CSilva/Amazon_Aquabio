/**
 * Formatação de números e nomes científicos.
 *
 * `milhar` e `formatarEspecie` vinham de `src/analises/tema.js` e
 * `src/analises/dados.js`, onde ficavam presos ao módulo dos gráficos. A galeria
 * e o mapa precisam das mesmas regras — nome científico se escreve igual em
 * qualquer seção.
 */

/**
 * Número com separador de milhar no idioma corrente.
 *
 * A versão antiga fixava `pt-BR`, então "15.712 pb" aparecia com ponto mesmo com
 * o site em inglês, onde o esperado é "15,712 bp".
 */
export function milhar(valor, idioma = "pt") {
    return Number(valor).toLocaleString(idioma === "en" ? "en-US" : "pt-BR");
}

/**
 * Parte de um nome científico o que vai em itálico do que não vai.
 *
 * Gênero e epíteto específico são itálico; qualificadores abertos não. Por isso
 * `Apistogramma sp Cuieiras` renderiza *Apistogramma* + " sp Cuieiras" em
 * redondo — a espécie não está descrita, e italizar `sp` afirmaria o contrário.
 *
 * @returns {{italico: string, resto: string}}
 */
export function formatarEspecie(nome) {
    const partes = String(nome).trim().split(/\s+/);
    if (partes.length > 2 && partes[1].startsWith("sp")) {
        return { italico: partes[0], resto: ` ${partes.slice(1).join(" ")}` };
    }
    return {
        italico: partes.slice(0, 2).join(" "),
        resto: partes.length > 2 ? ` ${partes.slice(2).join(" ")}` : "",
    };
}

/** `Acaronia_nassa` → `Acaronia nassa`. As chaves do pipeline usam underscore. */
export function desnormalizarEspecie(chave) {
    return String(chave).replace(/_/g, " ");
}
