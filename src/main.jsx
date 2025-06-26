import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
//pages
import ErrorPage from "./routes/error-page";
import App from "./App";
import Home from "./routes/home";
import Contato from "./routes/contato";
import theme from "./theme";
import EstilosGlobais from "./componentes/EstilosGlobais";
import ComparadorVisual from "./Home/B6_Comparador/B6Visualizador/visualizador";


// const isProduction = import.meta.env.PROD;

const router = createBrowserRouter(
    [
        {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
            path: "/",
            element: <Home />,
            },
            {
            path: "/Contato",
            element: <Contato />,
            },
            {
            path: "/comparador-visual",
            element: <ComparadorVisual />,
            },
        ],
        },
    ],
    {
        // basename: isProduction ? "/Amazon_Aquabio/" : undefined,

        basename: "/Amazon_Aquabio/",

    }
    );

    const rootElement = document.getElementById("root");

    if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
        <EstilosGlobais />
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
        </React.StrictMode>
    );
    } else {
    console.error("Element with id 'root' not found.");
}