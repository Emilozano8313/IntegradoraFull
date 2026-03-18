import React, { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';

const POLL_INTERVAL_MS = 8000; // 8 segundos — balance entre reactividad y carga al servidor

/**
 * Configuración visual de cada estado de la orden.
 */
const ESTADOS_CONFIG = {
    pendiente_confirmacion: {
        label: 'Pendiente de Confirmación',
        sublabel: 'Tu pedido está esperando ser aceptado por el mesero.',
        icon: '⏳',
        color: '#856404',
        bg: '#FFF3CD',
        step: 1,
    },
    confirmada: {
        label: 'Pedido Confirmado',
        sublabel: 'El mesero aceptó tu pedido, pronto lo prepararemos.',
        icon: '✅',
        color: '#0C5460',
        bg: '#D1ECF1',
        step: 2,
    },
    en_preparacion: {
        label: 'En Preparación',
        sublabel: 'Nuestros chefs están trabajando en tu pedido.',
        icon: '👨‍🍳',
        color: '#004085',
        bg: '#CCE5FF',
        step: 3,
    },
    lista: {
        label: '¡Listo para servir!',
        sublabel: 'Tu pedido está listo. El mesero lo llevará a tu mesa.',
        icon: '🍽️',
        color: '#155724',
        bg: '#D4EDDA',
        step: 4,
    },
    entregada: {
        label: 'Orden Entregada',
        sublabel: '¡Buen provecho! Disfruta tu comida.',
        icon: '🎉',
        color: '#383D41',
        bg: '#E2E3E5',
        step: 5,
    },
    cerrada: {
        label: 'Cuenta Cerrada',
        sublabel: '¡Gracias por tu visita! Esperamos verte pronto.',
        icon: '💳',
        color: '#383D41',
        bg: '#E2E3E5',
        step: 6,
    },
    cancelada: {
        label: 'Pedido Cancelado',
        sublabel: 'El pedido fue cancelado. Por favor, contacta al mesero.',
        icon: '❌',
        color: '#721C24',
        bg: '#F8D7DA',
        step: 0,
    },
};

const PASOS_BARRA = [
    { step: 1, label: 'Recibido' },
    { step: 2, label: 'Confirmado' },
    { step: 3, label: 'Preparando' },
    { step: 4, label: 'Listo' },
    { step: 5, label: 'Entregado' },
];

/**
 * OrderTracker.jsx — Pantalla de trazabilidad de la orden
 *
 * Implementa polling real con useEffect + setInterval.
 * Consulta GET /api/ordenes/{id} cada POLL_INTERVAL_MS ms.
 * Se detiene automáticamente cuando la orden está cerrada/cancelada.
 *
 * Props:
 *   ordenId    — ID de la orden a rastrear
 *   onNuevoPedido — callback para hacer un nuevo pedido
 */
const OrderTracker = ({ ordenId, onNuevoPedido }) => {
    const { ordenActual, startOrderPolling, stopOrderPolling } = useAppStore();
    const intervalRef = useRef(null);

    // Estado vivo de la orden
    const orden = ordenActual;
    const estado = orden?.estado || 'pendiente_confirmacion';
    const config = ESTADOS_CONFIG[estado] || ESTADOS_CONFIG['pendiente_confirmacion'];
    const esFinal = ['cerrada', 'cancelada', 'entregada'].includes(estado);

    // Iniciar polling al montar, limpiar al desmontar
    useEffect(() => {
        if (!ordenId) return;

        startOrderPolling(ordenId);

        return () => {
            stopOrderPolling();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ordenId]);

    return (
        <div className="d-flex flex-column min-vh-100" style={{ background: '#F4F5F7' }}>

            {/* ── Header ────────────────────────────────────────────── */}
            <header
                className="text-white px-4 pt-4 pb-5"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #E06900)' }}
            >
                <p className="mb-1 opacity-75 small">Pedido #{ordenId}</p>
                <h1 className="fw-bold fs-4 mb-0">Estado de tu Orden</h1>
            </header>

            <div className="container px-3" style={{ marginTop: '-2rem' }}>

                {/* ── Tarjeta de estado principal ───────────────────── */}
                <div
                    className="card border-0 shadow mb-4"
                    style={{ borderRadius: '1.25rem' }}
                >
                    <div className="card-body p-4 text-center">
                        {/* Ícono grande animado */}
                        <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                            style={{
                                width: 80, height: 80,
                                background: config.bg,
                                fontSize: 40,
                                transition: 'all 0.5s ease',
                            }}
                        >
                            {config.icon}
                        </div>

                        {/* Estado principal */}
                        <h2 className="fw-bold fs-5 mb-1" style={{ color: config.color }}>
                            {config.label}
                        </h2>
                        <p className="text-muted small mb-0">{config.sublabel}</p>

                        {/* Indicador de polling activo */}
                        {!esFinal && (
                            <div className="mt-3 d-flex align-items-center justify-content-center gap-2 text-muted small">
                                <span
                                    className="spinner-grow spinner-grow-sm text-primary"
                                    role="status"
                                    style={{ animationDuration: '1.5s' }}
                                />
                                Actualizando automáticamente
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Barra de progreso por pasos ───────────────────── */}
                {estado !== 'cancelada' && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem' }}>
                        <div className="card-body px-4 py-3">
                            <div className="d-flex justify-content-between align-items-end position-relative">
                                {/* Línea de progreso */}
                                <div
                                    className="position-absolute"
                                    style={{
                                        top: 14, left: '5%', right: '5%', height: 4,
                                        background: '#E9ECEF', borderRadius: 2, zIndex: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '100%',
                                            background: '#FF7A00',
                                            borderRadius: 2,
                                            width: `${Math.max(0, ((config.step - 1) / (PASOS_BARRA.length - 1)) * 100)}%`,
                                            transition: 'width 0.6s ease',
                                        }}
                                    />
                                </div>

                                {/* Pasos */}
                                {PASOS_BARRA.map(paso => {
                                    const completado = config.step >= paso.step;
                                    const activo = config.step === paso.step;
                                    return (
                                        <div key={paso.step} className="d-flex flex-column align-items-center" style={{ zIndex: 1, flex: 1 }}>
                                            <div
                                                style={{
                                                    width: 28, height: 28,
                                                    borderRadius: '50%',
                                                    background: completado ? '#FF7A00' : '#E9ECEF',
                                                    border: activo ? '3px solid #FF7A00' : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: completado ? '#fff' : '#adb5bd',
                                                    fontWeight: 700,
                                                    fontSize: 13,
                                                    boxShadow: activo ? '0 0 0 4px rgba(255,122,0,0.2)' : 'none',
                                                    transition: 'all 0.4s ease',
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {completado && !activo ? '✓' : paso.step}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: completado ? 700 : 400,
                                                    color: completado ? '#FF7A00' : '#adb5bd',
                                                }}
                                            >
                                                {paso.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Resumen de la orden ───────────────────────────── */}
                {orden?.detalles?.length > 0 && (
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem' }}>
                        <div className="card-header bg-transparent border-bottom py-3">
                            <h6 className="fw-bold mb-0">📋 Detalle del Pedido</h6>
                        </div>
                        <div className="card-body p-0">
                            {orden.detalles.map((det, idx) => {
                                const estadoBadge = {
                                    pendiente: { cls: 'bg-warning text-dark', txt: 'Pendiente' },
                                    en_preparacion: { cls: 'bg-info', txt: 'Preparando...' },
                                    listo: { cls: 'bg-success', txt: 'Listo ✓' },
                                    entregado: { cls: 'bg-secondary', txt: 'Entregado' },
                                }[det.estado_preparacion] || { cls: 'bg-light', txt: det.estado_preparacion };

                                return (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
                                        style={{ borderColor: '#F0F0F0' }}
                                    >
                                        <div>
                                            <span className="fw-semibold small">{det.producto}</span>
                                            <span className="text-muted small ms-2">x{det.cantidad}</span>
                                            {det.nota_cliente && (
                                                <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                                                    📝 {det.nota_cliente}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`badge ${estadoBadge.cls} rounded-pill`} style={{ fontSize: '0.7rem' }}>
                                            {estadoBadge.txt}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Totales */}
                        <div className="card-footer bg-transparent px-4 py-3">
                            <div className="d-flex justify-content-between small text-muted">
                                <span>Subtotal</span><span>${Number(orden.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between small text-muted">
                                <span>IVA (16%)</span><span>${Number(orden.iva).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold mt-1">
                                <span>Total</span>
                                <span className="text-primary">${Number(orden.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Acciones finales ──────────────────────────────── */}
                {estado === 'cerrada' && (
                    <button
                        className="btn btn-primary w-100 fw-bold py-3 mb-4"
                        style={{ borderRadius: '0.75rem' }}
                        onClick={onNuevoPedido}
                    >
                        Hacer Nuevo Pedido
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderTracker;
