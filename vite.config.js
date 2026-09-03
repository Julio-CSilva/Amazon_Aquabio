import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    // O site vive num subcaminho do GitHub Pages. Isto alimenta
    // `import.meta.env.BASE_URL`, de onde saem os fetches de `public/data/` e a
    // URL que o comparador abre em nova aba.
    base: "/Amazon_Aquabio/",
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                // Plotly sozinho pesa mais que todo o resto do app. Mantê-lo num
                // chunk próprio tira-o do carregamento inicial: só as abas de
                // análise o puxam.
                manualChunks: {
                    plotly: ["plotly.js-cartesian-dist-min", "react-plotly.js"],
                    // O GSAP é usado desde o topo da página (a tinta de seção e o
                    // traçado do mitogenoma), então não dá para adiá-lo. Num
                    // chunk próprio ele ao menos é baixado em paralelo e
                    // sobrevive no cache entre deploys — o código do app muda a
                    // cada publicação, a biblioteca não.
                    gsap: ["gsap", "gsap/ScrollTrigger", "@gsap/react"],
                },
            },
        },
    },
});
