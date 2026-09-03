import { createHashRouter, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { ErroDeRota } from "./ErroDeRota";
import { HomePage } from "@/pages/HomePage";

/**
 * Rotas.
 *
 * Roteamento por hash porque o site é servido de um subcaminho do GitHub Pages,
 * que não sabe reescrever caminhos profundos para o index.html.
 *
 * A home é importada de forma direta — é o destino de praticamente toda visita,
 * e adiar seu carregamento só acrescentaria um salto de rede antes da primeira
 * pintura. As demais são `lazy`: antes, `main.jsx` importava as três páginas
 * junto com Chakra e Plotly, e quem só queria ler a home baixava o comparador
 * inteiro.
 */
export const router = createHashRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErroDeRota />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "contato",
                lazy: async () => ({
                    Component: (await import("@/pages/ContactPage")).ContactPage,
                }),
            },
            {
                // O comparador abre esta URL em nova aba. O caminho é parte do
                // contrato: mudá-lo quebraria qualquer link já compartilhado.
                path: "comparador-visual",
                lazy: async () => ({
                    Component: (await import("@/pages/ComparisonPage")).ComparisonPage,
                }),
            },
            // A rota antiga era "/Contato", com maiúscula. Links já enviados por
            // e-mail continuam existindo; redirecionar é mais barato que
            // quebrá-los.
            { path: "Contato", element: <Navigate to="/contato" replace /> },
            {
                path: "*",
                lazy: async () => ({
                    Component: (await import("@/pages/NotFoundPage")).NotFoundPage,
                }),
            },
        ],
    },
]);
