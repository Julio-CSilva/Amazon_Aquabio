/**
 * Limite de erro do roteador.
 *
 * Fica fora de `router.jsx` por dois motivos: o Fast Refresh só preserva estado
 * em módulos que exportam apenas componentes, e — mais importante — este é o
 * componente que precisa renderizar quando algo mais falhou, inclusive o
 * carregamento de um chunk. Quanto menos ele importa, maior a chance de
 * conseguir aparecer.
 *
 * Por isso também o texto é bilíngue fixo, e não vem do i18n: se o provider de
 * idioma for justamente o que quebrou, `t()` levaria a tela de erro junto.
 */
export function ErroDeRota() {
    return (
        <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
            <div className="space-y-3">
                <h1 className="font-display text-4xl font-semibold text-fg">Oops!</h1>
                <p className="text-fg-muted">Algo deu errado. / Something went wrong.</p>
                <a href="./" className="inline-block text-sm text-primary underline">
                    Voltar ao início / Back to home
                </a>
            </div>
        </div>
    );
}
