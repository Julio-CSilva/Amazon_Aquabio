import styled from "styled-components"
import { Outlet } from 'react-router-dom';
import EstilosGlobais from "./componentes/EstilosGlobais"
import Cabecalho from "./componentes/Cabecalho"

const FundoGradiente = styled.div`
  background: linear-gradient(180deg, #2E838C 0%, #037373 20%, #061721 80%, #080412 100%);
  width: 100%;
  min-height: 100vh;
`

const PatternFundo = styled.div`
  background-image: url(/images/pattern.png);
  background-repeat: repeat-y;
  width: 100%;
  min-height: 100vh;
  background-position: center;
`

const AppContainer = styled.div`
  width: 100%;
  margin: 0 auto;
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
        
    </FundoGradiente>
  )
}

export default App
