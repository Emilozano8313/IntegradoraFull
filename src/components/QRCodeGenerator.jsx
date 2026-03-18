import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 

const QRGenerator = () => {
    const [baseUrl, setBaseUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('qr_base_url');
            if (saved) return saved;

            const url = new URL(window.location.href);
            return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
        }
        return '';
    });

    useEffect(() => {
        if (baseUrl) {
            localStorage.setItem('qr_base_url', baseUrl);
        }
    }, [baseUrl]);

    const tables = Array.from({ length: 10 }, (_, i) => i + 1); // Mesas 1 a 10

    const printPage = () => {
        window.print();
    };

    const handleUrlChange = (e) => {
        setBaseUrl(e.target.value);
    };

    const resetUrl = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            setBaseUrl(`${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 print:bg-white print:p-0">
            <div className="max-w-6xl mx-auto print:max-w-none">
                
                {/* Cabecera */}
                <header className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">QRs del Sistema</h1>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <label className="text-gray-600 font-semibold text-sm uppercase tracking-wider">URL Base Red</label>
                            <input
                                type="text"
                                value={baseUrl}
                                onChange={handleUrlChange}
                                className="bg-gray-50 border border-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-72 sm:w-96"
                                placeholder="http://192.168.1.100:5173"
                            />
                            <button
                                onClick={resetUrl}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Restaurar Localhost
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Para que el sistema funcione en celulares, ingresa la IP IPv4 de este PC en la red WiFi.
                        </p>
                    </div>
                    
                    <button
                        onClick={printPage}
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-gray-900 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                        <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Imprimir Formato A4
                    </button>
                </header>

                <div className="space-y-12 print:space-y-8">
                    
                    {/* SECCIÓN STAFF (Meseros y Cocina) */}
                    <section>
                        <div className="flex items-center gap-4 mb-6 print:hidden">
                            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest pl-4 border-l-4 border-emerald-500">Accesos del Staff</h2>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
                            
                            {/* QR MESEROS */}
                            <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-center text-center transition-transform hover:shadow-md print:shadow-none print:border-2 print:border-dashed print:p-4 print:break-inside-avoid group">
                                <div className="absolute top-0 w-full h-1.5 bg-emerald-500"></div>
                                <span className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-bold leading-none text-emerald-800 bg-emerald-100 rounded-full">
                                    ADMINISTRATIVO
                                </span>
                                <h2 className="text-2xl font-black mb-4 tracking-wider text-emerald-900">APP MESERO</h2>
                                
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                                    <QRCodeSVG value={`${baseUrl}/?mesero=true`} size={180} level="H" includeMargin={true} fgColor="#047857" />
                                </div>
                                <p className="mt-4 text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded truncate w-full">{`${baseUrl}/?mesero=true`}</p>
                                <p className="mt-3 text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                    </svg>
                                    Acceso a Toma de Pedidos
                                </p>
                            </div>

                            {/* QR COCINA */}
                            <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center text-center transition-transform hover:shadow-md print:shadow-none print:border-2 print:border-dashed print:p-4 print:break-inside-avoid group">
                                <div className="absolute top-0 w-full h-1.5 bg-blue-500"></div>
                                <span className="inline-flex items-center justify-center px-3 py-1 mb-3 text-xs font-bold leading-none text-blue-800 bg-blue-100 rounded-full">
                                    INTERNO
                                </span>
                                <h2 className="text-2xl font-black mb-4 tracking-wider text-blue-900">KDS COCINA</h2>
                                
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 group-hover:scale-105 transition-transform duration-300">
                                    <QRCodeSVG value={`${baseUrl}/?cocina=true`} size={180} level="H" includeMargin={true} fgColor="#1d4ed8" />
                                </div>
                                <p className="mt-4 text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded truncate w-full">{`${baseUrl}/?cocina=true`}</p>
                                <p className="mt-3 text-sm font-bold text-blue-700 flex items-center justify-center gap-1">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                                    </svg>
                                    Pantallas de Preparación
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* SECCIÓN CLIENTES (Mesas) */}
                    <section>
                        <div className="flex items-center gap-4 mb-6 print:hidden">
                            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest pl-4 border-l-4 border-orange-500">Menú para Clientes</h2>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4">
                            {tables.map(num => (
                                <div key={num} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-lg hover:border-orange-200 print:shadow-none print:border-2 print:border-dashed print:p-4 print:break-inside-avoid hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black text-xl mb-3 shadow-sm border border-white ring-2 ring-orange-50">
                                        {num}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 uppercase tracking-widest text-gray-800">Mesa {num}</h2>
                                    
                                    <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 mb-3">
                                        <QRCodeSVG value={`${baseUrl}/?mesa=${num}`} size={160} level="H" includeMargin={true} fgColor="#1f2937" />
                                    </div>
                                    
                                    <p className="text-[10px] text-gray-400 font-mono w-full truncate mb-2" title={`${baseUrl}/?mesa=${num}`}>{`${baseUrl}/?mesa=${num}`}</p>
                                    <div className="w-full bg-orange-50 py-1.5 rounded-lg border border-orange-100">
                                        <p className="text-xs font-bold text-orange-600">ESCANEA PARA ORDENAR</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default QRGenerator;
