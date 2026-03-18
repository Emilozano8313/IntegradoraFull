import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';

// Página exclusiva para el Demo: Cliente
import ClientePage from './pages/ClientePage';

/**
 * App.jsx — Router simplificado (Standalone Demo)
 *
 * Demo: Ignora los parámetros y siempre carga la vista del cliente.
 * Se inicializa en la mesa #1 por defecto de manera simulada.
 */
function App() {
  const { setNumeroMesa } = useAppStore();

  useEffect(() => {
    // Simulamos que el cliente escaneó el QR de la Mesa 1
    setNumeroMesa(1);
  }, [setNumeroMesa]);

  return <ClientePage />;
}

export default App;
