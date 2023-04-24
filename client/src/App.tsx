import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RoutesComponent from './components/Routes/RoutesComponent';
import { HealthProvider } from './providers/HealthProvider';
import { AuthProvider } from './providers/AuthProvider';
function App() {
  return (
    <HealthProvider>
      <AuthProvider>
        <BrowserRouter>
          <RoutesComponent />
        </BrowserRouter>
      </AuthProvider>
    </HealthProvider>
  );
}
export default App;
