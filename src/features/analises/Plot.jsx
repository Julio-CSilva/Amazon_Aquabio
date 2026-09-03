import { Suspense, lazy } from "react";
import { useIdioma } from "@/i18n/contexto";
import { CONFIG_PADRAO } from "./configPlot";
import { Spinner } from "./Spinner";

const PlotlyLazy = lazy(() => import("./plotlyBundle"));

const Carregando = () => {
    const { t } = useIdioma();
    return (
        <div className="flex h-[220px] flex-col items-center justify-center gap-3">
            <Spinner />
            <p className="text-sm text-neutral-500">{t("analise.carregandoGrafico")}</p>
        </div>
    );
};

/**
 * Plotly com carregamento sob demanda.
 *
 * Aceita as mesmas props do `react-plotly.js`; `config` já vem preenchido com
 * `CONFIG_PADRAO` e pode ser sobrescrito.
 *
 * A regra do `modebar` sobe a barra de ferramentas em 4 px para ela não encostar
 * na borda do cartão. Vai em `<style>` local porque é um seletor sobre marcação
 * gerada pelo Plotly, que não passa pelas nossas classes.
 */
const Plot = ({ config, ...props }) => (
    <div className="w-full [&_.js-plotly-plot_.plotly_.modebar]:top-[-4px]">
        <Suspense fallback={<Carregando />}>
            <PlotlyLazy
                config={{ ...CONFIG_PADRAO, ...config }}
                useResizeHandler
                style={{ width: "100%" }}
                {...props}
            />
        </Suspense>
    </div>
);

export default Plot;
