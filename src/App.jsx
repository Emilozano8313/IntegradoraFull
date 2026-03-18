import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';

// Páginas por rol
import ClientePage from './pages/ClientePage';
import MeseroPage from './pages/MeseroPage';
import KitchenDashboard from './components/KitchenDashboard';
import QRCodeGenerator from './components/QRCodeGenerator';
import MenuAdmin from './components/MenuAdmin';
import AdminLogin from './components/AdminLogin';

/**
 * App.jsx — Router principal basado en URL params
 *
 * ?mesa=N        → Módulo cliente (entra DIRECTO al catálogo)
 * ?mesero=true   → Módulo mesero (login + dashboard)
 * ?cocina=true   → Módulo cocina (KDS)
 * ?admin=menu    → Panel admin menú (requiere login admin)
 * ?admin=qr      → Generador de QRs
 * (sin params)   → Login de Administrador
 */
function App() {
  const { setNumeroMesa, fetchCurrentUser, usuario } = useAppStore();

  const params = new URLSearchParams(window.location.search);
  const esCocina = Boolean(params.get('cocina'));
  const esMesero = Boolean(params.get('mesero'));
  const adminView = params.get('admin');
  const mesaParam = params.get('mesa');

  useEffect(() => {
    if (mesaParam && !esCocina) {
      setNumeroMesa(parseInt(mesaParam, 10));
    }
    const esStaff = esCocina || esMesero || Boolean(adminView) || (!mesaParam && !esCocina && !esMesero);
    if (esStaff) {
      fetchCurrentUser().catch(() => { });
    }
  }, [mesaParam, esCocina, esMesero, adminView, setNumeroMesa, fetchCurrentUser]);

  // ── Routing ──────────────────────────────────────────────────────────────
  if (esMesero) return <MeseroPage />;
  if (esCocina) return <KitchenDashboard />;

  // Admin: requiere sesión activa con rol admin
  if (adminView === 'qr') return <QRCodeGenerator />;
  if (adminView === 'menu') {
    if (!usuario) return <AdminLogin onLoginExitoso={() => fetchCurrentUser()} />;
    return <MenuAdmin />;
  }

  // URL con mesa → Cliente va directo al catálogo
  if (mesaParam) return <ClientePage />;

  // Raíz / sin parámetros → Login de Administrador
  if (!usuario || usuario.rol !== 'admin') {
    return <AdminLogin onLoginExitoso={() => fetchCurrentUser()} />;
  }
  return <MenuAdmin />;
}

export default App;
