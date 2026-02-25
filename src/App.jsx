import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import Welcome from './components/Welcome';
import Menu from './components/Menu';
import Cart from './components/Cart';
import KitchenDashboard from './components/KitchenDashboard';
import QRCodeGenerator from './components/QRCodeGenerator';
import MenuAdmin from './components/MenuAdmin';

function App() {
  const { numeroMesa, setNumeroMesa } = useAppStore();

  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cocina')) return 'kitchen';
    if (params.get('admin') === 'qr') return 'qr';
    if (params.get('admin') === 'menu') return 'menu-admin';
    return 'menu';
  });

  useEffect(() => {
    // Escuchar cambios en FireStore para tener órdenes en tiempo real
    const unsubscribeOrders = useAppStore.getState().initializeOrdersListener();
    // Escuchar cambios en Productos (Menú Dinámico)
    const unsubscribeProducts = useAppStore.getState().initializeProductsListener();

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mesaParam = params.get('mesa');

    if (mesaParam && !params.get('cocina')) {
      setNumeroMesa(parseInt(mesaParam));
    }
  }, [setNumeroMesa]);

  if (view === 'kitchen') {
    return <KitchenDashboard />;
  }

  if (view === 'qr') {
    return <QRCodeGenerator />;
  }

  if (view === 'menu-admin') {
    return <MenuAdmin />;
  }

  if (!numeroMesa) {
    return <Welcome />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {view === 'menu' && <Menu onViewCart={() => setView('cart')} />}
      {view === 'cart' && <Cart onBack={() => setView('menu')} />}
    </div>
  );
}

export default App;
