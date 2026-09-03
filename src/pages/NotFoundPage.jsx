import { Link } from "react-router-dom";
import { useIdioma } from "@/i18n/contexto";

export function NotFoundPage() {
    const { t } = useIdioma();

    return (
        <div className="grid min-h-[60vh] place-items-center px-6 text-center">
            <div className="space-y-4">
                <h1 className="font-display text-5xl font-semibold text-fg">
                    {t("erro.titulo")}
                </h1>
                <p className="text-fg-muted">{t("erro.naoEncontrado")}</p>
                <Link
                    to="/"
                    className="inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                    {t("erro.voltar")}
                </Link>
            </div>
        </div>
    );
}
