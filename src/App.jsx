import styled from "styled-components"
import { Outlet } from 'react-router-dom';
import EstilosGlobais from "./componentes/EstilosGlobais"
import Cabecalho from "./componentes/Cabecalho"
import Footer from "./componentes/Footer";

const FundoGradiente = styled.div`
  background: linear-gradient(180deg, #2E838C 0%, #037373 20%, #061721 80%, #080412 100%);
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

const PatternFundo = styled.div`
  background-image: url(/images/pattern.png);
  background-repeat: repeat;
  width: 100%;
  flex: 1;
  background-position: center;
  overflow-x: hidden;
`

const AppContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: hidden;
`

function App() {
  return (
    <FundoGradiente>
      <EstilosGlobais />
      <Cabecalho />
      <PatternFundo>
        <AppContainer>
          <Outlet/>
        </AppContainer>
      </PatternFundo>
      <Footer />
    </FundoGradiente>
  )
}

export default App
