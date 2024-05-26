import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
//pages
import ErrorPage from './routes/error-page';
import App from './App';
import Home from './routes/home';
import About from './routes/about';
import Metodologia from './routes/metodologia';
import Pesquisadores from './routes/pesquisadores';
import Contato from './routes/contato';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/About",
        element: <About />
      },
      {
        path: "/Metodologia",
        element: <Metodologia />
      },
      {
        path: "/Pesquisadores",
        element: <Pesquisadores />
      },
      {
        path: "/Contato",
        element: <Contato />
      }
    ]
  }
]);

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider> 
    </React.StrictMode>
  );
} else {
  console.error("Element with id 'root' not found.");
}
