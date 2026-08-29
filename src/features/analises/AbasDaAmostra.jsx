import Zoom from "react-medium-image-zoom";
import { useIdioma } from "@/i18n/contexto";
import { Figura } from "@/components/ui/figura";
import SinteniaPlot from "./SinteniaPlot";
import RscuPlot from "./RscuPlot";
import TandemRepeatsPlot from "./TandemRepeatsPlot";
import { AbasPapel } from "./AbasPapel";

/**
 * Figura estática de uma amostra (mitogenoma circularizado, tRNA).
 *
 * São os arquivos mais pesados do acervo: PNGs de ~370 KB exibidos com 600 px de
 * altura. Servidos como AVIF de 800 px, caem para ~24 KB — 94% a menos, com a
 * mesma leitura na tela. O original continua no `<img>` de dentro do `<picture>`
 * como fallback e como destino do zoom.
 */
const Estatica = ({ src, alt }) => (
    <div className="max-w-full overflow-hidden rounded-lg shadow-md">
        <Zoom>
            <Figura
                src={src}
                alt={alt}
                tamanhos="(min-width: 768px) 800px, 100vw"
                className="mx-auto max-h-[220px] w-full cursor-zoom-in rounded-lg object-contain md:max-h-[600px]"
            />
        </Zoom>
    </div>
);

/**
 * As análises de uma amostra, uma aba cada.
 *
 * Substitui o carrossel de imagens sem rótulo: ali não dava para saber qual
 * análise estava na tela sem reconhecer o desenho. Três das cinco abas agora
 * são interativas, e o Radix só monta o painel ativo — então o Plotly (e o JSON
 * da análise) só são baixados quando a aba for aberta de fato.
 */
export default function AbasDaAmostra({ amostra, especie }) {
    const { t } = useIdioma();
    const sras = [amostra.sra];

    return (
        <AbasPapel
            abas={[
                {
                    valor: "circular",
                    rotulo: t("abas.circular"),
                    conteudo: (
                        <Estatica
                            src={amostra.path_mito_circularized}
                            alt={`${t("abas.circular")} ${amostra.sra}`}
                        />
                    ),
                },
                {
                    valor: "trna",
                    rotulo: t("abas.trna"),
                    conteudo: (
                        <Estatica
                            src={amostra.path_trna}
                            alt={`${t("abas.trna")} ${amostra.sra}`}
                        />
                    ),
                },
                {
                    valor: "sintenia",
                    rotulo: t("abas.sintenia"),
                    conteudo: <SinteniaPlot sras={sras} />,
                },
                {
                    valor: "rscu",
                    rotulo: t("abas.rscu"),
                    conteudo: <RscuPlot sras={sras} />,
                },
                {
                    valor: "dloop",
                    rotulo: t("abas.dloop"),
                    conteudo: <TandemRepeatsPlot sras={sras} especies={[especie]} />,
                },
            ]}
        />
    );
}
