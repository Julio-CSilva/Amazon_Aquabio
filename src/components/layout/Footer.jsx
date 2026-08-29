// Marcas vêm do `react-icons`, não do `lucide-react`: o Lucide deixou de
// distribuir logotipos de terceiros (GitHub, LinkedIn, ORCID) por serem marcas
// registradas, com forma definida por quem as detém — não são ícones de
// interface que um conjunto possa redesenhar. O resto da UI usa Lucide.
import { FaGithub } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import { asset } from "@/lib/assets";
import { useIdioma } from "@/i18n/contexto";
import { useAnalise } from "@/features/analises/dados";

const APOIADORES = [
    {
        sigla: "CAPES",
        nome: "Coordenação de Aperfeiçoamento de Pessoal de Nível Superior",
        tipo: "Agência de Fomento",
        tipoEn: "Funding Agency",
        href: "https://www.gov.br/capes/pt-br",
        logo: "images/logos/capes.png",
    },
    {
        sigla: "UFRN",
        nome: "Universidade Federal do Rio Grande do Norte",
        tipo: "Universidade",
        tipoEn: "Federal University",
        href: "https://ufrn.br/",
        logo: "images/logos/ufrn.png",
    },
    {
        sigla: "IMD",
        nome: "Instituto Metrópole Digital",
        tipo: "Instituto de TI e Inovação",
        tipoEn: "IT & Innovation Institute",
        href: "https://imd.ufrn.br/portal/",
        logo: "images/logos/portal_imd.png",
    },
    {
        sigla: "PPG-Bioinfo",
        nome: "Programa de Pós-Graduação em Bioinformática",
        tipo: "Pós-Graduação",
        tipoEn: "Graduate Program",
        href: "https://sigaa.ufrn.br/sigaa/public/programa/portal.jsf?id=9814",
        logo: "images/logos/ppg.png",
    },
    {
        sigla: "BioME",
        nome: "Centro Multiusuário de Bioinformática",
        tipo: "Centro Multiusuário",
        tipoEn: "Bioinformatics Core Facility",
        href: "https://bioinfo.imd.ufrn.br/site",
        logo: "images/logos/biome-logo.png",
    },
];

const DESENVOLVEDORES = [
    { nome: "J. Silva", github: "https://github.com/Julio-CSilva" },
    { nome: "Gabriel V.", github: "https://github.com/Gabrienzo" },
];

const VERSAO = import.meta.env.VITE_APP_VERSION ?? "1.6.6";

export function Footer() {
    const { t, idioma } = useIdioma();
    const ano = new Date().getFullYear();

    /**
     * A data de atualização dos dados vem do próprio dado.
     *
     * Antes era uma constante no componente (`"2025/08/26"`) que ninguém lembrava
     * de mexer: o rodapé anunciava agosto de 2025 enquanto os JSON traziam
     * `meta.gerado_em` de agosto de 2026. O pipeline já carimba a data em cada
     * arquivo que gera — ler dali é o que mantém as duas coisas verdadeiras ao
     * mesmo tempo. `sintenia` já é buscado pela página; reusar o cache de
     * `useAnalise` não custa requisição nova.
     */
    const { dados } = useAnalise("sintenia");
    const geradoEm = dados?.meta?.gerado_em;
    const atualizacao = geradoEm
        ? new Date(geradoEm).toLocaleDateString(idioma === "pt" ? "pt-BR" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <footer className="border-t border-border/80 bg-card/85 backdrop-blur-md">
            <div className="mx-auto max-w-[110rem] px-4 py-12 md:px-8">
                <section className="space-y-6">
                    <div className="text-center space-y-1.5">
                        <h2 className="eyebrow text-primary tracking-widest">{t("rodape.apoio")}</h2>
                        <p className="text-xs text-fg-muted max-w-lg mx-auto">
                            {t("rodape.apoioDesc")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                        {APOIADORES.map((apoiador) => (
                            <a
                                key={apoiador.sigla}
                                href={apoiador.href}
                                target="_blank"
                                rel="noreferrer"
                                title={`${apoiador.nome} (${apoiador.sigla})`}
                                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <div className="flex h-16 w-full items-center justify-center rounded-lg bg-white/95 p-2.5 shadow-2xs transition-transform duration-300 group-hover:scale-[1.02]">
                                    <img
                                        src={asset(apoiador.logo)}
                                        alt={apoiador.nome}
                                        loading="lazy"
                                        decoding="async"
                                        className="max-h-12 w-auto max-w-full object-contain"
                                    />
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <span className="font-mono text-xs font-semibold text-fg group-hover:text-primary transition-colors">
                                            {apoiador.sigla}
                                        </span>
                                        <p className="truncate text-[0.7rem] text-fg-muted" title={apoiador.nome}>
                                            {idioma === "en" ? apoiador.tipoEn : apoiador.tipo}
                                        </p>
                                    </div>
                                    <ArrowUpRight className="size-4 shrink-0 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                <hr className="my-10 border-border" />

                <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                    <div>
                        <h2 className="eyebrow mb-3">{t("rodape.criadores")}</h2>
                        <ul className="flex flex-wrap items-center justify-center gap-3">
                            {DESENVOLVEDORES.map((dev) => (
                                <li key={dev.github}>
                                    <a
                                        href={dev.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-primary hover:text-fg"
                                    >
                                        <FaGithub className="size-3.5" />
                                        {dev.nome}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-1 text-xs text-fg-muted">
                        <p>
                            {t("rodape.versao")}{" "}
                            <span className="tabular">{VERSAO}</span>
                        </p>
                        {atualizacao && (
                            <p>
                                {t("rodape.ultimaAtualizacao")}:{" "}
                                <span className="tabular">{atualizacao}</span>
                            </p>
                        )}
                        <p>
                            © {ano} {t("site.nome")} — {t("rodape.direitos")} by BioME.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
