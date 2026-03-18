import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';


/**
 * MeseroLogin.jsx — Formulario de login para staff (mesero/admin).
 * POST /api/auth/login → guarda sesión en el store.
 */
const MeseroLogin = ({ onLoginExitoso, titulo = 'Portal de Mesero', icono = '🧑‍🍽️', demoEmail = 'mesero@rest.com' }) => {
    const { login } = useAppStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            onLoginExitoso();
        } catch (err) {
            setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)' }}
        >
            <div className="card border-0 shadow-lg p-4" style={{ width: '100%', maxWidth: 400, borderRadius: '1.25rem' }}>
                {/* Logo / header */}
                <div className="text-center mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{ width: 64, height: 64, background: 'var(--color-primary, #e67e22)', fontSize: 28 }}
                    >
                        {icono}
                    </div>
                    <h1 className="fs-4 fw-bold mb-0">{titulo}</h1>
                    <p className="text-muted small mt-1">Sistema de Gestión de Restaurante</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="mesero@rest.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small" style={{ borderRadius: '0.75rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2 mt-1"
                        style={{ borderRadius: '0.75rem' }}
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner-border spinner-border-sm me-2" />Ingresando...</>
                            : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="text-center text-muted small mt-3 mb-0">
                    Demo: <code>{demoEmail}</code> / <code>123456</code>
                </p>
            </div>
        </div>
    );
};

export default MeseroLogin;
