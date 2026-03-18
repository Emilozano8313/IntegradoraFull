import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

const IVA_RATE = 0.16; // 16% IVA México

/**
 * Carrito.jsx — Resumen del pedido con IVA y notas por producto
 *
 * Props:
 *   onBack           — volver al menú
 *   onPedidoEnviado  — callback con la orden creada { orden_id, ... }
 */
const Carrito = ({ onBack, onPedidoEnviado }) => {
    const {
        carrito,
        numeroMesa,
        actualizarNotaItem,
        eliminarDelCarrito,
        incrementarCantidad,
        decrementarCantidad,
        limpiarCarrito,
        addOrder,
    } = useAppStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Cálculos de totales ─────────────────────────────────────
    const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    const handleConfirmar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);
        setError('');

        try {
            const orden = await addOrder();   // POST /api/ordenes
            limpiarCarrito();
            onPedidoEnviado(orden);           // Navega al tracker
        } catch (err) {
            if (err.status === 409) {
                setError('Esta mesa ya tiene una orden activa. Llama al mesero.');
            } else {
                setError(err.message || 'Error al enviar el pedido. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (carrito.length === 0) {
        return (
            <div className="min-vh-100 d-flex flex-column">
                <header className="bg-white px-3 py-3 border-bottom d-flex align-items-center gap-3 sticky-top">
                    <button className="btn btn-light rounded-circle p-2" onClick={onBack}>
                        ←
                    </button>
                    <h1 className="fs-5 fw-bold mb-0">Mi Pedido</h1>
                </header>
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted p-4">
                    <p style={{ fontSize: 64 }}>🛒</p>
                    <p className="fw-semibold fs-5">Tu pedido está vacío</p>
                    <button className="btn btn-primary mt-2" onClick={onBack} style={{ borderRadius: '0.75rem' }}>
                        Ver el Menú
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100" style={{ paddingBottom: 160 }}>

            {/* ── Header ────────────────────────────────────────────── */}
            <header className="bg-white px-3 py-3 border-bottom d-flex align-items-center gap-3 sticky-top" style={{ zIndex: 50 }}>
                <button className="btn btn-light rounded-circle p-2 lh-1" onClick={onBack}>←</button>
                <h1 className="fs-5 fw-bold mb-0 flex-grow-1">Mi Pedido</h1>
                <span className="badge bg-primary rounded-pill">{carrito.length} platillos</span>
            </header>

            {/* ── Lista de ítems ────────────────────────────────────── */}
            <div className="flex-grow-1 p-3 d-flex flex-column gap-3">

                <p className="text-muted small mb-0">
                    🪑 Mesa #{numeroMesa} &nbsp;·&nbsp;
                    <span className="fw-semibold text-dark">{carrito.reduce((s, i) => s + i.cantidad, 0)} items</span>
                </p>

                {carrito.map(item => (
                    <div key={item.id} className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                        <div className="card-body p-3">

                            {/* Fila superior: nombre + precio + eliminar */}
                            <div className="d-flex align-items-start justify-content-between mb-2">
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-0 lh-sm">{item.nombre}</h6>
                                    <span className="text-primary fw-bold">
                                        ${(item.precio * item.cantidad).toFixed(2)}
                                    </span>
                                    {item.cantidad > 1 && (
                                        <span className="text-muted small ms-1">
                                            (${Number(item.precio).toFixed(2)} c/u)
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-danger border-0 rounded-circle p-1 lh-1"
                                    onClick={() => eliminarDelCarrito(item.id)}
                                    style={{ width: 32, height: 32 }}
                                    title="Eliminar"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Control de cantidad */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="text-muted small">Cantidad:</span>
                                <div className="d-flex align-items-center bg-light rounded-pill px-2 gap-2">
                                    <button
                                        className="btn btn-sm p-0 fw-bold fs-5 text-danger border-0 bg-transparent"
                                        style={{ width: 28 }}
                                        onClick={() => {
                                            if (item.cantidad === 1) eliminarDelCarrito(item.id);
                                            else decrementarCantidad(item.id);
                                        }}
                                    >
                                        −
                                    </button>
                                    <span className="fw-bold text-primary px-1">{item.cantidad}</span>
                                    <button
                                        className="btn btn-sm p-0 fw-bold fs-5 text-primary border-0 bg-transparent"
                                        style={{ width: 28 }}
                                        onClick={() => incrementarCantidad(item.id)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Notas / instrucciones especiales */}
                            <label className="form-label small text-muted mb-1">
                                📝 Instrucciones especiales
                            </label>
                            <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                placeholder={`ej. sin cebolla, término medio, alérgico a nueces...`}
                                value={item.notas || ''}
                                onChange={e => actualizarNotaItem(item.id, e.target.value)}
                                style={{ borderRadius: '0.6rem', resize: 'none', fontSize: '0.82rem' }}
                                maxLength={200}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Panel fijo de totales + botón ─────────────────────── */}
            <div
                className="position-fixed bottom-0 start-0 end-0 bg-white border-top p-3 shadow-lg"
                style={{ zIndex: 100 }}
            >
                {/* Desglose de precios */}
                <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between text-muted small mb-2">
                    <span>IVA (16%)</span>
                    <span>${iva.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                {/* Error de envío */}
                {error && (
                    <div className="alert alert-danger py-2 px-3 mb-2 small d-flex gap-2 align-items-center" style={{ borderRadius: '0.75rem' }}>
                        <span>⚠️</span>{error}
                    </div>
                )}

                <button
                    className="btn btn-primary w-100 fw-bold py-3"
                    style={{ borderRadius: '0.75rem' }}
                    onClick={handleConfirmar}
                    disabled={loading || carrito.length === 0}
                >
                    {loading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Enviando pedido...
                        </span>
                    ) : (
                        `✓ Confirmar Pedido · $${total.toFixed(2)}`
                    )}
                </button>
            </div>
        </div>
    );
};

export default Carrito;
