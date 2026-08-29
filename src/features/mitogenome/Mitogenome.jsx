import { useMemo, useState } from "react";
import { useIdioma } from "@/i18n/contexto";
import { useTema } from "@/theme/contexto";
import { Reveal } from "@/components/motion/Reveal";
import { TituloDeSecao } from "@/components/ui/TituloDeSecao";
import { useAnalise } from "@/features/analises/dados";
import { EstadoCarga } from "@/features/analises/EstadoCarga";
import { montarSegmentos } from "./geometria";
import { MapaCircular } from "./MapaCircular";

/**
 * A amostra que abre a seção.
 *
 * *Pygocentrus nattereri* não é escolha estética: é o mitogenoma semente do
 * estudo (NC_015840.1), o de referência para todas as montagens do NOVOPlasty.
 * Começar por ele liga a figura à metodologia logo abaixo.
 */
const PADRAO = "SRR25740028";

export function Mitogenome() {
    const { t } = useIdioma();
    const { tema } = useTema();
    const [sra, setSra] = useState(PADRAO);

    const sintenia = useAnalise("sintenia");
    const repeticoes = useAnalise("tandem_repeats");

    /** Uma amostra por espécie, em ordem alfabética, para o seletor. */
    const opcoes = useMemo(() => {
        if (!sintenia.dados) return [];
        const porEspecie = new Map();
        for (const [chave, amostra] of Object.entries(sintenia.dados.amostras)) {
            if (!porEspecie.has(amostra.especie)) {
                porEspecie.set(amostra.especie, chave);
            }
        }
        return [...porEspecie.entries()]
            .map(([especie, chave]) => ({ especie, sra: chave }))
            .sort((a, b) => a.especie.localeCompare(b.especie));
    }, [sintenia.dados]);

    const mapa = useMemo(() => {
        if (!sintenia.dados?.amostras[sra]) return null;

        // O tamanho da região controle vive no outro conjunto, medido por
        // espécie. Ver a nota longa em `geometria.js` sobre por que ele é
        // necessário para o círculo não mentir.
        const especie = sintenia.dados.amostras[sra].especie.replace(/ /g, "_");
        const controlePb = repeticoes.dados?.individuos?.[especie]?.cr_pb;

        // O tema entra aqui e não no componente do desenho porque é a paleta dos
        // ARCOS que muda: `sintenia.json` traz um par claro/escuro por gene, e a
        // legenda deriva as cores dela dos mesmos arcos. Se os dois lessem temas
        // diferentes, a legenda deixaria de descrever a figura ao lado.
        return montarSegmentos(sintenia.dados, sra, controlePb, tema);
    }, [sintenia.dados, repeticoes.dados, sra, tema]);

    return (
        <section id="mitogenoma" className="scroll-mt-24 py-20 md:py-28">
            <div className="mx-auto grid max-w-[110rem] items-start gap-12 px-4 md:grid-cols-2 md:px-8">
                <div>
                    <TituloDeSecao
                        indice={1}
                        etiqueta={t("mitogenoma.etiqueta")}
                        titulo={t("mitogenoma.titulo")}
                    />
                    <div className="prose-measure mt-6 space-y-4 pl-5 text-base leading-relaxed text-fg-muted">
                        <p>{t("mitogenoma.corpo1")}</p>
                        <p>{t("mitogenoma.corpo2")}</p>
                    </div>

                    {opcoes.length > 0 && (
                        <div className="mt-8 pl-5">
                            <label
                                htmlFor="seletor-especie"
                                className="eyebrow mb-2 block"
                            >
                                {t("mitogenoma.escolherEspecie")}
                            </label>
                            <select
                                id="seletor-especie"
                                value={sra}
                                onChange={(evento) => setSra(evento.target.value)}
                                className="w-full max-w-sm rounded-lg border border-border bg-card px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-primary"
                            >
                                {opcoes.map((opcao) => (
                                    <option key={opcao.sra} value={opcao.sra}>
                                        {opcao.especie}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <Reveal atraso={0.1}>
                    {sintenia.carregando || sintenia.erro ? (
                        <EstadoCarga
                            carregando={sintenia.carregando}
                            erro={sintenia.erro}
                        />
                    ) : mapa ? (
                        // A chave remonta o SVG ao trocar de espécie, para o
                        // traçado recomeçar em vez de os arcos saltarem para as
                        // novas posições.
                        <MapaCircular key={sra} mapa={mapa} dados={sintenia.dados} />
                    ) : null}
                </Reveal>
            </div>
        </section>
    );
}
