import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/**
 * Abas sobre superfície de papel.
 *
 * Não usa `components/ui/tabs` porque aquele é pintado com os tokens do site —
 * `bg-muted` e `bg-background` são escuros no tema padrão, e estas abas ficam
 * dentro dos cartões claros das figuras. Ver a nota em `tema.js`.
 *
 * As cores vêm dos tokens `--paper-*` de `styles/tokens.css`, que valem o mesmo
 * nos dois temas. O estado ativo é estilizado por `data-state`, que é o Radix
 * quem escreve — daí não haver nenhum estado de aba no React aqui.
 *
 * O `Tabs.Content` do Radix só monta o painel ativo, que é o comportamento que
 * queremos: o bundle do Plotly e o JSON da análise só são baixados quando
 * alguém realmente abre aquela aba.
 */
export function AbasPapel({ abas, padrao, className }) {
    return (
        <Tabs.Root defaultValue={padrao ?? abas[0]?.valor} className={className}>
            <Tabs.List className="mb-3 flex flex-wrap gap-1">
                {abas.map((aba) => (
                    <Tabs.Trigger
                        key={aba.valor}
                        value={aba.valor}
                        className={cn(
                            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                            "text-(--paper-teal-dark) hover:bg-(--paper-teal-hover)",
                            "data-[state=active]:bg-(--paper-teal) data-[state=active]:text-white",
                        )}
                    >
                        {aba.rotulo}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>

            {abas.map((aba) => (
                <Tabs.Content
                    key={aba.valor}
                    value={aba.valor}
                    className="focus-visible:outline-none"
                >
                    {aba.conteudo}
                </Tabs.Content>
            ))}
        </Tabs.Root>
    );
}
