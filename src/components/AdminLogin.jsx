import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const AdminLogin = ({ onLoginExitoso }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Asumiendo que existe un login en el store 
    const { login } = useAppStore();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(credentials.email, credentials.password);
            if (onLoginExitoso) onLoginExitoso();
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-sm" style={{ width: '400px' }}>
                <div className="card-body p-5">
                    <h2 className="text-center mb-4">Acceso Administrativo</h2>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-muted fw-bold">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg bg-light"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="admin@rest.com"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-muted fw-bold">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg bg-light"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-dark w-100 py-3 fw-bold"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
