import React from 'react';
import './App.css';
import { DAppProvider, Config, Localhost } from '@usedapp/core';
import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './components/Routes/RoutesComponent';
function App() {
  const config: Config = {
    readOnlyChainId: Localhost.chainId,
    readOnlyUrls: {
      [Localhost.chainId]: 'http://127.0.0.1:8545',
    },
  }
  return (
    <DAppProvider config={config}>
      <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </DAppProvider>
  );
}

export default App;
