import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const AdminLogin = ({ onLoginExitoso }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
            
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 opacity-20 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600 opacity-20 blur-[100px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Tarjeta Glassmorphism */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
                    
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 shadow-inner mb-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Acceso Admin</h2>
                        <p className="text-blue-200 mt-0.5 text-xs">Ingresa credenciales de sistema</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-100 rounded-lg p-3 mb-6 text-sm text-center animate-pulse">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder-white/30"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="admin@rest.com"
                                required
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder-white/30"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <span>Iniciar Sesión</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="text-center text-white/40 text-xs mt-6">
                    &copy; 2026 Admin Dashboard. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
