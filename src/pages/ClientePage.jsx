import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import MesaIngreso from '../components/cliente/MesaIngreso';
import FidelidadModal from '../components/cliente/FidelidadModal';
import MenuCliente from '../components/cliente/MenuCliente';
import Carrito from '../components/cliente/Carrito';
import OrderTracker from '../components/cliente/OrderTracker';

/**
 * ClientePage.jsx — Orquestador del flujo completo del cliente
 *
 * Máquina de estados (vista):
 *   'ingreso'   → validar número de mesa
 *   'fidelidad' → modal de puntos (se abre automáticamente al ingresar)
 *   'menu'      → catálogo de platillos
 *   'carrito'   → resumen + IVA + notas
 *   'tracker'   → estado de la orden en tiempo real (polling)
 */
const ClientePage = () => {
    const { numeroMesa, ordenActual, fetchProducts, setNumeroMesa } = useAppStore();

    // Leer mesa directamente de la URL (QR) para evitar condición de carrera con el store
    const mesaDesdeUrl = new URLSearchParams(window.location.search).get('mesa');

    // Si la mesa viene de la URL, asegurar que el store la tenga
    useEffect(() => {
        if (mesaDesdeUrl && !numeroMesa) {
            setNumeroMesa(parseInt(mesaDesdeUrl, 10));
        }
    }, [mesaDesdeUrl, numeroMesa, setNumeroMesa]);

    const mesaActiva = numeroMesa || (mesaDesdeUrl ? parseInt(mesaDesdeUrl, 10) : null);

    const [vista, setVista] = useState(() => {
        return mesaActiva ? 'menu' : 'ingreso';
    });

    const [ordenId, setOrdenId] = useState(ordenActual?.orden_id || null);

    useEffect(() => {
        if (vista === 'menu' || vista === 'fidelidad') {
            fetchProducts();
        }
    }, [vista, fetchProducts]);

    const handleMesaValida = () => setVista('fidelidad');
    const handleContinuarMenu = () => setVista('menu');
    const handleVerCarrito = () => setVista('carrito');
    const handleVolverMenu = () => setVista('menu');
    const handlePedidoEnviado = (ord) => { setOrdenId(ord.orden_id); setVista('tracker'); };
    const handleNuevoPedido = () => { setOrdenId(null); setVista('menu'); };

    switch (vista) {
        case 'ingreso':
            return <MesaIngreso onMesaValida={handleMesaValida} />;

        case 'fidelidad':
            return (
                <>
                    <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />
                    <FidelidadModal onContinue={handleContinuarMenu} />
                </>
            );

        case 'menu':
            return <MenuCliente numeroMesa={mesaActiva} onVerCarrito={handleVerCarrito} />;

        case 'carrito':
            return <Carrito onBack={handleVolverMenu} onPedidoEnviado={handlePedidoEnviado} />;

        case 'tracker':
            return <OrderTracker ordenId={ordenId} onNuevoPedido={handleNuevoPedido} />;

        default:
            return <MesaIngreso onMesaValida={handleMesaValida} />;
    }
};

export default ClientePage;
