import { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Tooltip, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useIdioma } from "@/i18n/contexto";

const CENTRO = [-2.9936, -58.4748];
const ZOOM = 5;
const ZOOM_MINIMO = 4;

/**
 * Cores dos pontos, em literal e não em token CSS.
 *
 * O Leaflet aplica cor escrevendo ATRIBUTOS de apresentação no SVG
 * (`stroke="…"`, `fill="…"`), e atributo SVG não resolve `var(--token)` — só a
 * propriedade CSS equivalente resolveria. Passar `var(--primary)` aqui daria
 * pontos sem cor nenhuma.
 *
 * Os valores são `river-500`/`river-400` e `silt-400` de `styles/tokens.css`.
 * Mudou lá, mude aqui.
 */
const COR = {
    realce: { borda: "#0e8272", preenchimento: "#27a18c" },
    recuado: { borda: "#9c9889", preenchimento: "#9c9889" },
};

const URL_DADOS = `${import.meta.env.BASE_URL}data/ocorrencias.json`;

/**
 * Reajusta o mapa quando o contêiner muda de tamanho.
 *
 * O Leaflet mede o contêiner uma vez, na montagem. Se ele ainda estiver com
 * altura zero — porque a seção entrou por uma animação, ou porque a fonte ainda
 * não carregou — o mapa fica com metade dos ladrilhos em cinza até alguém
 * redimensionar a janela. O ResizeObserver fecha esse buraco.
 */
function AjustarAoContainer() {
    const mapa = useMap();

    useEffect(() => {
        const alvo = mapa.getContainer();
        const observador = new ResizeObserver(() => mapa.invalidateSize());
        observador.observe(alvo);
        return () => observador.disconnect();
    }, [mapa]);

    return null;
}

export default function MapaLeaflet({ especieSelecionada }) {
    const { t } = useIdioma();
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        let ativo = true;
        fetch(URL_DADOS)
            .then((resposta) => {
                if (!resposta.ok) throw new Error(`ocorrencias.json: ${resposta.status}`);
                return resposta.json();
            })
            .then((json) => ativo && setDados(json))
            .catch((e) => ativo && setErro(e));
        return () => {
            ativo = false;
        };
    }, []);

    /**
     * Pontos achatados, cada um sabendo a que espécie pertence.
     *
     * Nada de agrupar em clusters: com no máximo 40 pontos por espécie, o
     * agrupamento esconderia justamente o padrão de distribuição que a seção
     * quer mostrar, e clusters não sabem representar "esta espécie sim, aquela
     * não". A leitura por seleção — realçar uma espécie e recuar as outras —
     * responde melhor à pergunta desta seção.
     */
    const pontos = useMemo(() => {
        if (!dados) return [];
        return dados.especies.flatMap((grupo) =>
            grupo.pontos.map((coordenada, indice) => ({
                chave: `${grupo.especie}-${indice}`,
                especie: grupo.especie,
                posicao: coordenada,
            })),
        );
    }, [dados]);

    if (erro) {
        return (
            <div className="grid h-full place-items-center rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-fg-muted">{t("mapa.erro")}</p>
            </div>
        );
    }

    if (!dados) {
        return (
            <div className="grid h-full place-items-center rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-fg-muted">{t("mapa.carregando")}</p>
            </div>
        );
    }

    return (
        <MapContainer
            center={CENTRO}
            zoom={ZOOM}
            minZoom={ZOOM_MINIMO}
            scrollWheelZoom={false}
            className="size-full rounded-xl"
            aria-label={t("mapa.titulo_acessivel")}
        >
            <AjustarAoContainer />
            <TileLayer
                // Atribuição do OpenStreetMap: é exigência da licença ODbL, não
                // um rodapé decorativo.
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                /*
                 * Filtro sobre os ladrilhos, e não um provedor de mapa escuro.
                 *
                 * O OSM padrão é claro e, numa página de água preta, o mapa vira
                 * um retângulo branco que rouba a atenção de tudo. Um provedor de
                 * ladrilhos escuros resolveria, mas acrescentaria dependência de
                 * um terceiro e outra atribuição a manter.
                 *
                 * A dessaturação e o escurecimento são leves de propósito: o
                 * suficiente para o mapa assentar na paleta, longe do ponto em
                 * que rios e fronteiras deixariam de ser legíveis — que é a
                 * informação pela qual o mapa existe.
                 */
                className="[filter:saturate(0.72)_brightness(0.86)_contrast(1.04)]"
            />

            {pontos.map((ponto) => {
                const realcado =
                    !especieSelecionada || ponto.especie === especieSelecionada;
                return (
                    <CircleMarker
                        key={ponto.chave}
                        center={ponto.posicao}
                        radius={realcado ? 5 : 3}
                        pathOptions={{
                            color: realcado ? COR.realce.borda : COR.recuado.borda,
                            weight: realcado ? 1.5 : 0.5,
                            fillColor: realcado
                                ? COR.realce.preenchimento
                                : COR.recuado.preenchimento,
                            fillOpacity: realcado ? 0.75 : 0.18,
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -4]}>
                            <i>{ponto.especie}</i>
                        </Tooltip>
                    </CircleMarker>
                );
            })}
        </MapContainer>
    );
}

