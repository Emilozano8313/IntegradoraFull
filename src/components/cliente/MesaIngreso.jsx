import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

/**
 * MesaIngreso.jsx — Pantalla de entrada del cliente
 *
 * Valida el número de mesa contra la API PHP:
 *   - Mesa libre  → llama onMesaValida(mesaId)
 *   - Mesa ocupada (409) → muestra error y bloquea acceso
 *   - Mesa no encontrada → error genérico
 */
const MesaIngreso = ({ onMesaValida }) => {
    const { validarMesa, setNumeroMesa } = useAppStore();

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numero = parseInt(input, 10);

        if (!numero || numero < 1) {
            setError('Ingresa un número de mesa válido.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const mesa = await validarMesa(numero);
            // Mesa libre → guardamos en el store y avanzamos
            setNumeroMesa(mesa.numero);
            onMesaValida(mesa);
        } catch (err) {
            if (err.status === 409) {
                setError('⛔ Esta mesa está ocupada. Por favor, llama al mesero.');
            } else if (err.status === 404) {
                setError('Mesa no encontrada. Verifica el número e intenta de nuevo.');
            } else {
                setError('Error de conexión. Revisa que el servidor esté disponible.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #E06900 100%)' }}
        >
            <div className="container" style={{ maxWidth: 420 }}>
                {/* Logo / Encabezado */}
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.2)' }}
                    >
                        <span style={{ fontSize: 40 }}>🍽️</span>
                    </div>
                    <h1 className="text-white fw-bold fs-2 mb-1">Bienvenido</h1>
                    <p className="text-white-50 mb-0">Ingresa el número de tu mesa para comenzar</p>
                </div>

                {/* Tarjeta de ingreso */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary small text-uppercase ls-wide">
                                    Número de Mesa
                                </label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text border-end-0 bg-light">
                                        <span style={{ fontSize: 20 }}>🪑</span>
                                    </span>
                                    <input
                                        type="number"
                                        className={`form-control border-start-0 bg-light fs-3 text-center fw-bold ${error ? 'is-invalid' : ''}`}
                                        placeholder="1"
                                        min="1"
                                        max="99"
                                        value={input}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                            setError('');
                                        }}
                                        disabled={loading}
                                        style={{ letterSpacing: '0.15em' }}
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <div className="alert alert-danger mt-3 mb-0 py-2 px-3 d-flex align-items-center gap-2" style={{ borderRadius: '0.75rem' }}>
                                        <span>⚠️</span>
                                        <small>{error}</small>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 fw-bold py-3 fs-5"
                                disabled={loading || !input}
                                style={{ borderRadius: '0.75rem' }}
                            >
                                {loading ? (
                                    <span>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Verificando...
                                    </span>
                                ) : (
                                    'Ver Menú →'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="text-white-50 text-center mt-3 small">
                    ¿No encuentras tu número? Pide ayuda al mesero.
                </p>
            </div>
        </div>
    );
};

export default MesaIngreso;
