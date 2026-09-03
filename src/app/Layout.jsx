import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Ambiente } from "@/components/motion/Ambiente";
import { ProgressoDeLeitura } from "@/components/motion/ProgressoDeLeitura";

/**
 * A casca de todas as páginas.
 *
 * Substitui os três `styled.div` aninhados de `App.jsx` (`FundoGradiente` >
 * `PatternFundo` > `AppContainer`), que existiam só para empilhar um gradiente,
 * um bitmap ladrilhado e um contêiner flex.
 *
 * ── Empilhamento ──
 *
 * O gradiente de profundidade NÃO é pintado neste elemento: ele é a camada mais
 * funda do `<Ambiente>`. Aqui, cobriria o Ambiente inteiro — um filho com
 * z-index negativo fica atrás do FUNDO do próprio pai, não apenas atrás do
 * conteúdo dele, e a malha e a aurora simplesmente sumiam.
 *
 * Com o Ambiente em `z-0` e o conteúdo em `z-10`, a ordem fica explícita e não
 * depende de índice negativo.
 *
 * `overflow-x: clip` no lugar de `hidden`: `hidden` num ancestral cria um
 * contexto de rolagem, e o ScrollTrigger passa a medir a rolagem desse contexto
 * em vez da janela — o pin da metodologia simplesmente não prende. Não é uma
 * precaução: é o que sustenta a seção 4 inteira, que hoje prende a tela por
 * quatro viewports. Trocar por `hidden` quebra aquela seção.
 */
export function Layout() {
    return (
        <div className="relative flex min-h-dvh flex-col overflow-x-clip">
            <Ambiente />
            <ProgressoDeLeitura />
            <Header />
            <main id="conteudo" className="relative z-10 flex-1 pt-[4.5rem]">
                <Outlet />
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
