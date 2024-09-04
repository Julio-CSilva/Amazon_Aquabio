import styled from "styled-components"
import { Outlet } from 'react-router-dom';
import Cabecalho from "./componentes/Cabecalho"
import Footer from "./componentes/Footer";
import { LanguageProvider } from "./componentes/LanguageContext";

const FundoGradiente = styled.div`
  background: linear-gradient(180deg, #2E838C 0%, #037373 20%, #061721 80%, #080412 100%);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const PatternFundo = styled.div`
  background-image: url(/images/pattern-pequeno.png);
  background-repeat: repeat;
  background-size: 10%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  `


const AppContainer = styled.div`
  width: 100%;
  flex: 1; 
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

function App() {
  return (
    <FundoGradiente>
      <LanguageProvider>
        <Cabecalho />
        <PatternFundo>
          <AppContainer>
            <Outlet />
          </AppContainer>
        </PatternFundo>
        <Footer />
      </LanguageProvider>
    </FundoGradiente>
  )
}

export default App
