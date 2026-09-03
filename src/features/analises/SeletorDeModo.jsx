import { cn } from "@/lib/utils";
import { SURFACE, TEAL, TEAL_ESCURO } from "./tema";

/**
 * Alternador de modo de visualização das figuras.
 *
 * Fica neste módulo, e não em `components/ui/`, porque é pintado com a paleta de
 * PAPEL — as cores das figuras do artigo — e não com os tokens do site. Colocá-lo
 * entre os primitivos gerais convidaria a usá-lo sobre o fundo escuro, onde
 * texto `TEAL_ESCURO` sobre branco fica ilegível.
 *
 * Ver a nota em `tema.js` sobre por que as análises não seguem o tema escuro.
 */
export function SeletorDeModo({ modos, valor, aoMudar, rotulo }) {
    return (
        <div
            role="group"
            aria-label={rotulo}
            className="inline-flex overflow-hidden rounded-md border"
            style={{ borderColor: TEAL }}
        >
            {modos.map(({ chave, texto }, indice) => {
                const ativo = valor === chave;
                return (
                    <button
                        key={chave}
                        type="button"
                        onClick={() => aoMudar(chave)}
                        aria-pressed={ativo}
                        className={cn(
                            "px-2.5 py-1 text-xs font-medium transition-colors",
                            indice > 0 && "border-l",
                        )}
                        style={{
                            borderColor: TEAL,
                            background: ativo ? TEAL : SURFACE,
                            color: ativo ? SURFACE : TEAL_ESCURO,
                        }}
                    >
                        {texto}
                    </button>
                );
            })}
        </div>
    );
}
