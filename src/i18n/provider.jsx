import { useCallback, useEffect, useMemo, useState } from "react";
import { ContextoDeIdioma } from "./contexto";
import pt from "./pt";
import en from "./en";

const DICIONARIOS = { pt, en };
const IDIOMAS = ["pt", "en"];
const CHAVE_ARMAZENAMENTO = "aquabio:idioma";

/**
 * Idioma inicial.
 *
 * Ordem: escolha anterior da pessoa > navegador em português > inglês.
 *
 * O inglês continua sendo o padrão para quem chega sem sinal nenhum — é a
 * decisão original do projeto, coerente com um público científico
 * internacional. O que muda é que um navegador configurado em português agora
 * recebe português já na primeira visita, em vez de precisar achar o toggle.
 */
function idiomaInicial() {
    if (typeof window === "undefined") return "en";

    try {
        const salvo = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
        if (IDIOMAS.includes(salvo)) return salvo;
    } catch {
        // Modo privado ou cookies bloqueados. Segue para a detecção.
    }

    const doNavegador = window.navigator?.language ?? "";
    return doNavegador.toLowerCase().startsWith("pt") ? "pt" : "en";
}

/** Caminho pontuado (`especie.baixarFasta`) até o valor no dicionário. */
function resolver(dicionario, chave) {
    return chave.split(".").reduce((atual, parte) => atual?.[parte], dicionario);
}

/**
 * Substitui `{marcador}` pelos valores passados.
 *
 * Mantém a frase inteira no arquivo de idioma em vez de concatenar pedaços no
 * componente — línguas diferentes ordenam as partes de formas diferentes, e
 * concatenação trava essa ordem na do português.
 */
function interpolar(texto, variaveis) {
    if (!variaveis) return texto;
    return texto.replace(/\{(\w+)\}/g, (original, nome) =>
        Object.prototype.hasOwnProperty.call(variaveis, nome)
            ? String(variaveis[nome])
            : original,
    );
}

export function ProvedorDeIdioma({ children }) {
    const [idioma, definirIdioma] = useState(idiomaInicial);

    useEffect(() => {
        try {
            window.localStorage.setItem(CHAVE_ARMAZENAMENTO, idioma);
        } catch {
            // Sem persistência, o idioma vale só para esta sessão. Não é erro.
        }
        // O <html lang> ficava preso em "en" no index.html. Leitores de tela
        // usam esse atributo para escolher a pronúncia — com ele errado, texto
        // em português sai lido com fonemas ingleses.
        document.documentElement.lang = idioma === "pt" ? "pt-BR" : "en";
    }, [idioma]);

    const t = useCallback(
        (chave, variaveis) => {
            const valor = resolver(DICIONARIOS[idioma], chave);

            if (valor === undefined) {
                if (import.meta.env.DEV) {
                    console.warn(`[i18n] chave ausente em "${idioma}": ${chave}`);
                }
                // Devolve a chave: aparece na tela como texto óbvio e
                // rastreável, em vez de um espaço em branco silencioso.
                return chave;
            }
            return typeof valor === "string" ? interpolar(valor, variaveis) : valor;
        },
        [idioma],
    );

    const valor = useMemo(
        () => ({
            idioma,
            /**
             * Apelido de `idioma`. Os módulos de `features/analises/` comparam
             * `language === "pt"` em dezenas de pontos; manter o campo evita
             * reescrever o código dos gráficos, que fora isso não muda.
             */
            language: idioma,
            definirIdioma,
            alternarIdioma: () => definirIdioma((atual) => (atual === "pt" ? "en" : "pt")),
            t,
        }),
        [idioma, t],
    );

    return <ContextoDeIdioma.Provider value={valor}>{children}</ContextoDeIdioma.Provider>;
}


/**
 * Confere, em desenvolvimento, se `pt.js` e `en.js` têm as mesmas chaves.
 *
 * Uma chave presente só num dos dois é invisível até alguém trocar o idioma na
 * página certa. Foi assim que os rótulos de status da IUCN passaram a mostrar
 * apenas inglês. Isto roda uma vez, no import, e nunca entra no bundle de
 * produção.
 */
if (import.meta.env.DEV) {
    const caminhos = (objeto, prefixo = "") =>
        Object.entries(objeto).flatMap(([chave, valor]) =>
            valor && typeof valor === "object" && !Array.isArray(valor)
                ? caminhos(valor, `${prefixo}${chave}.`)
                : [`${prefixo}${chave}`],
        );

    const emPt = new Set(caminhos(pt));
    const emEn = new Set(caminhos(en));
    const soPt = [...emPt].filter((c) => !emEn.has(c));
    const soEn = [...emEn].filter((c) => !emPt.has(c));

    if (soPt.length) console.warn("[i18n] faltam em en.js:", soPt);
    if (soEn.length) console.warn("[i18n] faltam em pt.js:", soEn);
}
