import styled from "styled-components";
import "./App.css";
import { EthAddressInput } from "./components/EthAddressInput";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
`;

function App() {
  const callback = (response) => {
    console.log(response);
  };

  return (
    <Layout className="App">
      <EthAddressInput callback={callback} />
    </Layout>
  );
}

export default App;
