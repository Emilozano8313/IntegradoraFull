import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import MeseroLogin from './mesero/MeseroLogin';

// ────────────────────────────────────────────────────────────────────────────
// KitchenTicket — tarjeta estilo "ticket de comanda"
// ────────────────────────────────────────────────────────────────────────────
const KitchenTicket = ({ orden, onPreparar, onTerminado, loading }) => {
    const esNueva = orden.estado === 'confirmada';
    const enPreparacion = orden.estado === 'en_preparacion';

    const createdAt = new Date(orden.created_at);
    const minutosAgo = Math.floor((Date.now() - createdAt.getTime()) / 60000);

    // Alerta de tiempo: > 12 min → urgente
    const esUrgente = minutosAgo > 12;

    return (
        <div
            className={`card border-2 shadow-sm h-100 ${esNueva ? 'border-danger' : 'border-warning'}`}
            style={{
                borderRadius: '0.75rem',
                fontFamily: "'Courier New', Courier, monospace",
                background: esUrgente ? '#fff5f5' : '#fff',
            }}
        >
            {/* ── Header del ticket ──────────────────────────────────── */}
            <div
                className={`card-header d-flex justify-content-between align-items-center py-2 ${esNueva ? 'bg-danger text-white' : 'bg-warning text-dark'}`}
                style={{ borderRadius: '0.65rem 0.65rem 0 0' }}
            >
                <div className="fw-bold fs-5">🪑 Mesa {orden.mesa_numero}</div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark">#{orden.orden_id}</span>
                    <span
                        className={`badge ${esUrgente ? 'bg-light text-danger fw-bold' : 'bg-light text-dark'}`}
                    >
                        {esUrgente ? '⚠️ ' : '⏱️ '}{minutosAgo} min
                    </span>
                </div>
            </div>

            {/* ── Ítems del pedido ───────────────────────────────────── */}
            <div className="card-body p-3">
                <div className="border-bottom border-dashed pb-2 mb-2">
                    {orden.detalles?.map((d, idx) => (
                        <div key={idx} className="mb-3">
                            {/* Línea principal */}
                            <div className="d-flex justify-content-between align-items-start">
                                <span className="fw-bold" style={{ fontSize: '1.05rem' }}>
                                    {d.cantidad}x {d.producto?.toUpperCase()}
                                </span>
                            </div>
                            {/* Nota del cliente — resaltada para que no se pase */}
                            {d.nota_cliente && d.nota_cliente.trim() !== '' && (
                                <div
                                    className="mt-1 px-2 py-1 rounded-2 fw-bold"
                                    style={{
                                        background: '#fff3cd',
                                        color: '#856404',
                                        border: '1px solid #ffc107',
                                        fontSize: '0.88rem',
                                    }}
                                >
                                    📝 {d.nota_cliente}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Estado legible */}
                <div className="text-muted small text-center mb-2">
                    {esNueva
                        ? '🔔 Nuevo pedido — esperando preparación'
                        : '🔥 En preparación...'}
                </div>
            </div>

            {/* ── Acción ────────────────────────────────────────────── */}
            <div className="card-footer bg-transparent p-3">
                {esNueva && (
                    <button
                        className="btn btn-danger w-100 fw-bold"
                        style={{ borderRadius: '0.6rem' }}
                        onClick={onPreparar}
                        disabled={loading}
                    >
                        {loading
                            ? <span className="spinner-border spinner-border-sm me-2" />
                            : '🔥 '}
                        Preparar
                    </button>
                )}
                {enPreparacion && (
                    <button
                        className="btn btn-success w-100 fw-bold"
                        style={{ borderRadius: '0.6rem' }}
                        onClick={onTerminado}
                        disabled={loading}
                    >
                        {loading
                            ? <span className="spinner-border spinner-border-sm me-2" />
                            : '✅ '}
                        Terminado
                    </button>
                )}
            </div>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
// KitchenDashboard principal
// ────────────────────────────────────────────────────────────────────────────
const KitchenDashboard = () => {
    const { usuario, fetchCurrentUser, cambiarEstadoOrden, logoutLocal } = useAppStore();


    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [ultimaSync, setUltimaSync] = useState(null);

    // ── Carga de órdenes desde /api/cocina/ordenes ──────────────────────────
    const cargarOrdenes = useCallback(async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${API_URL}/cocina/ordenes`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                setOrdenes(data);
                setUltimaSync(new Date());
            }
        } catch (e) {
            console.error('KDS: Error cargando órdenes de cocina', e);
        } finally {
            setLoading(false);
        }
    }, []);

    // 1) Restaurar sesión al montar
    useEffect(() => {
        fetchCurrentUser().catch(() => { });
    }, [fetchCurrentUser]);

    // 2) Arrancar polling SOLO cuando hay sesión activa
    useEffect(() => {
        if (!usuario) return;
        cargarOrdenes();
        const interval = setInterval(cargarOrdenes, 10_000);
        return () => clearInterval(interval);
    }, [usuario, cargarOrdenes]);

    // ── Cambio de estado ────────────────────────────────────────────────────
    const accionEstado = async (ordenId, nuevoEstado) => {
        setLoadingId(ordenId);
        try {
            await cambiarEstadoOrden(ordenId, nuevoEstado);
            await cargarOrdenes();
        } finally {
            setLoadingId(null);
        }
    };

    // ── Sin sesión → Login ──────────────────────────────────────────────────
    if (!usuario) {
        return (
            <MeseroLogin
                onLoginExitoso={() => fetchCurrentUser()}
                titulo="Portal de Cocina"
                icono="👨‍🍳"
                demoEmail="chef1@rest.com"
            />
        );
    }

    // Separar columnas
    const nuevas = ordenes.filter(o => o.estado === 'confirmada');
    const enPreparacion = ordenes.filter(o => o.estado === 'en_preparacion');

    return (
        <div className="min-vh-100" style={{ background: '#1a1a2e' }}>

            {/* ── Header KDS ──────────────────────────────────────────── */}
            <header className="sticky-top shadow py-2 px-3 d-flex justify-content-between align-items-center"
                style={{ background: '#16213e', borderBottom: '3px solid #e67e22' }}
            >
                <div className="d-flex align-items-center gap-3">
                    <span style={{ fontSize: 28 }}>👨‍🍳</span>
                    <div>
                        <h1 className="text-white fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
                            KDS — Cocina en Vivo
                        </h1>
                        <span className="text-white-50" style={{ fontSize: '0.72rem' }}>
                            Chef: {usuario.nombre}
                        </span>
                    </div>
                    <div className="d-flex gap-2 ms-2">
                        <span className="badge bg-danger rounded-pill fs-6 px-3">
                            {nuevas.length} nuevas
                        </span>
                        <span className="badge bg-warning text-dark rounded-pill fs-6 px-3">
                            {enPreparacion.length} en cocina
                        </span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                    {ultimaSync && (
                        <span className="text-white-50 d-none d-md-inline" style={{ fontSize: '0.7rem' }}>
                            🔄 {ultimaSync.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    )}
                    <button
                        className="btn btn-sm btn-outline-light"
                        style={{ borderRadius: '0.75rem' }}
                        onClick={logoutLocal}
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* ── Dos columnas ────────────────────────────────────────── */}
            <div className="container-fluid px-3 py-3">
                {loading ? (
                    <div className="text-center py-5 text-white">
                        <div className="spinner-border text-warning mb-3" />
                        <p>Cargando tickets...</p>
                    </div>
                ) : (
                    <div className="row g-3">

                        {/* Columna NUEVAS (confirmada) */}
                        <div className="col-12 col-lg-6">
                            <div
                                className="rounded-3 p-3"
                                style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)' }}
                            >
                                <h5 className="text-danger fw-bold mb-3">
                                    🔔 Nuevas ({nuevas.length})
                                </h5>
                                {nuevas.length === 0 ? (
                                    <p className="text-center text-white-50 py-4">Sin pedidos nuevos</p>
                                ) : (
                                    <div className="row g-3">
                                        {nuevas.map(o => (
                                            <div key={o.orden_id} className="col-12 col-xl-6">
                                                <KitchenTicket
                                                    orden={o}
                                                    loading={loadingId === o.orden_id}
                                                    onPreparar={() => accionEstado(o.orden_id, 'en_preparacion')}
                                                    onTerminado={() => accionEstado(o.orden_id, 'lista')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna EN PREPARACIÓN */}
                        <div className="col-12 col-lg-6">
                            <div
                                className="rounded-3 p-3"
                                style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)' }}
                            >
                                <h5 className="text-warning fw-bold mb-3">
                                    🔥 En preparación ({enPreparacion.length})
                                </h5>
                                {enPreparacion.length === 0 ? (
                                    <p className="text-center text-white-50 py-4">Nada en cocina</p>
                                ) : (
                                    <div className="row g-3">
                                        {enPreparacion.map(o => (
                                            <div key={o.orden_id} className="col-12 col-xl-6">
                                                <KitchenTicket
                                                    orden={o}
                                                    loading={loadingId === o.orden_id}
                                                    onPreparar={() => accionEstado(o.orden_id, 'en_preparacion')}
                                                    onTerminado={() => accionEstado(o.orden_id, 'lista')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard;
