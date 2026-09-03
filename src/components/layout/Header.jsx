import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/assets";
import { useIdioma } from "@/i18n/contexto";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { SECOES_DO_MENU, IDS_SECOES } from "@/app/secoes";
import { AlternadorDeIdioma, AlternadorDeTema } from "./Alternadores";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
    const { t } = useIdioma();
    const { pathname } = useLocation();
    const [rolou, setRolou] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);

    const naHome = pathname === "/";
    // O observador só faz sentido onde as seções existem. Fora da home, uma
    // lista vazia evita procurar ids que não estão no documento.
    const ativo = useScrollSpy(naHome ? IDS_SECOES : []);

    useEffect(() => {
        const aoRolar = () => setRolou(window.scrollY > 24);
        aoRolar();
        window.addEventListener("scroll", aoRolar, { passive: true });
        return () => window.removeEventListener("scroll", aoRolar);
    }, []);

    /**
     * Leva até uma seção.
     *
     * ── Por que o href é `#/#secao` e não `#secao` ──
     *
     * O app usa HashRouter: a rota inteira vive depois do primeiro `#`. Um
     * `href="#galeria"` SUBSTITUI esse hash, o router lê "galeria" como caminho,
     * não encontra rota e serve a página de erro. Ou seja: com o href ingênuo,
     * todo item do menu derrubava o site.
     *
     * `#/#galeria` mantém `/` como caminho e `galeria` como âncora — o histórico
     * continua correto e o endereço é compartilhável. A rolagem em si é feita
     * aqui, porque o alvo não é um fragmento de documento que o navegador saiba
     * resolver sozinho.
     */
    const irPara = (id) => (evento) => {
        setMenuAberto(false);
        if (!naHome) return; // Deixa a navegação acontecer; a HomePage rola ao montar.

        evento.preventDefault();
        window.history.replaceState(null, "", `#/#${id}`);
        if (id === "apresentacao") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const itens = SECOES_DO_MENU.map((secao) => ({
        ...secao,
        texto: t(secao.rotulo),
        href: `#/#${secao.id}`,
    }));

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                rolou
                    ? "border-b border-border bg-bg/85 backdrop-blur-md"
                    : "border-b border-transparent bg-transparent",
            )}
        >
            <a
                href="#conteudo"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
            >
                {t("nav.irParaConteudo")}
            </a>

            <div
                className={cn(
                    "mx-auto flex max-w-[110rem] items-center gap-4 px-4 transition-all duration-300 md:px-8",
                    rolou ? "h-14" : "h-[4.5rem]",
                )}
            >
                <a
                    href="#/#apresentacao"
                    onClick={irPara("apresentacao")}
                    className="shrink-0"
                    aria-label={t("site.nome")}
                >
                    <img
                        src={asset("images/logo-sigla-sf.png")}
                        alt={t("site.nome")}
                        className={cn(
                            "w-auto transition-all duration-300",
                            rolou ? "h-8" : "h-10",
                        )}
                    />
                </a>

                <nav className="ml-auto hidden items-center gap-1 lg:flex">
                    {itens.map((item) => {
                        const estaAtivo = naHome && ativo === item.id;
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={irPara(item.id)}
                                aria-current={estaAtivo ? "true" : undefined}
                                className={cn(
                                    "relative rounded-full px-3 py-1.5 text-[0.8rem] font-medium tracking-wide transition-colors",
                                    estaAtivo ? "text-fg" : "text-fg-muted hover:text-fg",
                                )}
                            >
                                {estaAtivo && (
                                    // `layoutId` faz a pílula deslizar entre os
                                    // itens em vez de sumir e reaparecer: o olho
                                    // acompanha a mudança em vez de reprocessá-la.
                                    <motion.span
                                        layoutId="pilula-secao"
                                        className="absolute inset-0 rounded-full bg-card ring-1 ring-border"
                                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                                    />
                                )}
                                <span className="relative">{item.texto}</span>
                            </a>
                        );
                    })}
                    <Link
                        to="/contato"
                        className={cn(
                            "ml-1 rounded-full px-3 py-1.5 text-[0.8rem] font-medium tracking-wide transition-colors",
                            pathname === "/contato"
                                ? "bg-card text-fg ring-1 ring-border"
                                : "text-fg-muted hover:text-fg",
                        )}
                    >
                        {t("nav.contato")}
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-2 lg:ml-4">
                    <AlternadorDeTema />
                    <AlternadorDeIdioma className="hidden sm:flex" />

                    <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
                        <SheetTrigger
                            className="grid size-8 place-items-center rounded-full border border-border bg-card/60 text-fg-muted transition-colors hover:text-fg lg:hidden"
                            aria-label={t("nav.abrirMenu")}
                        >
                            <Menu className="size-4" />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[min(20rem,85vw)] bg-bg">
                            <SheetHeader>
                                <SheetTitle className="font-display">{t("nav.menu")}</SheetTitle>
                            </SheetHeader>
                            <nav className="mt-2 flex flex-col px-4 pb-6">
                                {itens.map((item) => (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        onClick={irPara(item.id)}
                                        className={cn(
                                            "border-b border-border py-3 text-sm font-medium transition-colors",
                                            naHome && ativo === item.id
                                                ? "text-primary"
                                                : "text-fg-muted hover:text-fg",
                                        )}
                                    >
                                        {item.texto}
                                    </a>
                                ))}
                                <Link
                                    to="/contato"
                                    onClick={() => setMenuAberto(false)}
                                    className="border-b border-border py-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                                >
                                    {t("nav.contato")}
                                </Link>
                                <AlternadorDeIdioma className="mt-6 self-start" />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
