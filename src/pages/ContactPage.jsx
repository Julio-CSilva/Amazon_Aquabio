import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { asset } from "@/lib/assets";
import { useIdioma } from "@/i18n/contexto";
import { Reveal } from "@/components/motion/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

/**
 * Credenciais do EmailJS.
 *
 * Eram literais no código-fonte. São chaves públicas — o EmailJS as expõe no
 * navegador por desenho, então isto não era um vazamento de segredo — mas
 * amarravam o formulário a uma conta específica: qualquer pessoa clonando o
 * repositório enviava mensagens para a caixa de outra. Em variáveis de
 * ambiente, cada instalação aponta para a sua.
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const CONFIGURADO = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const MAPA_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992.2917656261782!2d-35.20635186842015!3d-5.832057913959955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b2ff75c341eaaf%3A0x9e690237eaddaf9a!2sMetr%C3%B3pole%20Digital%20-%20IMD%2FUFRN!5e0!3m2!1spt-BR!2sbr!4v1744206397926!5m2!1spt-BR!2sbr";

function Campo({ id, rotulo, children }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium text-fg">
                {rotulo}
            </label>
            {children}
        </div>
    );
}

export function ContactPage() {
    const { t } = useIdioma();
    const formulario = useRef(null);
    const [estado, setEstado] = useState("parado");

    const enviar = async (evento) => {
        evento.preventDefault();
        if (!CONFIGURADO) {
            setEstado("naoConfigurado");
            return;
        }

        setEstado("enviando");
        try {
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formulario.current, PUBLIC_KEY);
            setEstado("sucesso");
            formulario.current.reset();
        } catch {
            setEstado("erro");
        }
    };

    return (
        <div className="mx-auto max-w-[80rem] px-4 py-16 md:px-8 md:py-24">
            <Reveal className="mb-12 text-center">
                <a
                    href="#/#apresentacao"
                    aria-label={t("site.nome")}
                    className="inline-block transition-opacity hover:opacity-80"
                >
                    <img
                        src={asset("images/aab-logo-home.svg")}
                        alt={t("site.nome")}
                        className="mx-auto h-20 w-auto"
                    />
                </a>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
                <Reveal className="rounded-2xl border border-border bg-card p-6 md:p-8">
                    <h1 className="font-display text-2xl font-semibold text-fg md:text-3xl">
                        {t("contato.titulo")}
                    </h1>

                    <form ref={formulario} onSubmit={enviar} className="mt-6 space-y-4">
                        <Campo id="nome" rotulo={t("contato.nome")}>
                            <Input id="nome" name="name" required autoComplete="name" />
                        </Campo>
                        <Campo id="email" rotulo={t("contato.email")}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                            />
                        </Campo>
                        <Campo id="instituicao" rotulo={t("contato.instituicaoOpcional")}>
                            <Input
                                id="instituicao"
                                name="instituicao"
                                autoComplete="organization"
                            />
                        </Campo>
                        <Campo id="mensagem" rotulo={t("contato.mensagem")}>
                            <Textarea id="mensagem" name="message" required rows={6} />
                        </Campo>

                        <Button type="submit" disabled={estado === "enviando"} className="gap-2">
                            <Send className="size-4" />
                            {estado === "enviando" ? t("contato.enviando") : t("contato.enviar")}
                        </Button>
                    </form>

                    {/* `role="status"` faz leitores de tela anunciarem o
                        resultado. Antes o retorno era só visual: quem não vê a
                        tela não sabia se a mensagem tinha saído. */}
                    <p role="status" aria-live="polite" className="mt-4 text-sm">
                        {estado === "sucesso" && (
                            <span className="text-primary">{t("contato.sucesso")}</span>
                        )}
                        {estado === "erro" && (
                            <span className="text-danger">{t("contato.erro")}</span>
                        )}
                        {estado === "naoConfigurado" && (
                            <span className="text-danger">{t("contato.naoConfigurado")}</span>
                        )}
                    </p>
                </Reveal>

                <Reveal
                    atraso={0.1}
                    className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 md:p-8"
                >
                    <div>
                        <p className="font-semibold text-fg">{t("contato.autor")}</p>
                        <p className="text-sm text-fg-muted">{t("contato.funcao")}</p>
                    </div>

                    <div>
                        <p className="eyebrow mb-1">{t("contato.rotuloAfiliacao")}</p>
                        <p className="text-sm text-fg-muted">{t("contato.afiliacao")}</p>
                    </div>

                    <div>
                        <p className="eyebrow mb-1">{t("contato.rotuloEmails")}</p>
                        {t("contato.emails").map((email) => (
                            <a
                                key={email}
                                href={`mailto:${email}`}
                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Mail className="size-3.5" />
                                {email}
                            </a>
                        ))}
                    </div>

                    <div>
                        <p className="eyebrow mb-1">
                            {t("contato.rotuloEnderecoInstitucional")}
                        </p>
                        <p className="flex gap-2 text-sm text-fg-muted">
                            <MapPin className="mt-0.5 size-3.5 shrink-0" />
                            <span>
                                {t("contato.enderecoInstitucional")}
                                <br />
                                {t("contato.endereco").map((linha) => (
                                    <span key={linha}>
                                        {linha}
                                        <br />
                                    </span>
                                ))}
                            </span>
                        </p>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-fg-muted">
                        <Phone className="size-3.5" />
                        <span className="tabular">{t("contato.telefone")}</span>
                    </p>
                </Reveal>
            </div>

            <Reveal className="mt-8 overflow-hidden rounded-2xl border border-border">
                <iframe
                    src={MAPA_EMBED}
                    title={t("contato.mapaTitulo")}
                    className="block h-[18rem] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </Reveal>
        </div>
    );
}
