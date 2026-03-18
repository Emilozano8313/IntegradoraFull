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
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-8 print:bg-white print:p-0">
            <div className="max-w-6xl mx-auto print:max-w-none">
                
                {/* Cabecera */}
                <header className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">QRs del Sistema</h1>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <label className="text-gray-600 font-semibold text-xs uppercase tracking-wider">URL Red</label>
                            <input
                                type="text"
                                value={baseUrl}
                                onChange={handleUrlChange}
                                className="bg-gray-50 border border-gray-200 text-gray-800 px-3 py-1.5 text-sm rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-60 sm:w-80"
                                placeholder="http://192.168.1.100:5173"
                            />
                            <button
                                onClick={resetUrl}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded-md transition-colors"
                            >
                                Localhost
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Para móviles, usa la IP IPv4 de este equipo.
                        </p>
                    </div>
                    
                    <button
                        onClick={printPage}
                        className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none overflow-hidden shadow-md hover:shadow-lg"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Imprimir A4
                    </button>
                </header>

                <div className="space-y-8 print:space-y-4">
                    
                    {/* SECCIÓN STAFF (Meseros y Cocina) */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 print:hidden">
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest pl-3 border-l-4 border-emerald-500">Accesos Staff</h2>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
                            
                            {/* QR MESEROS */}
                            <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md print:shadow-none print:border print:border-dashed print:p-2 print:break-inside-avoid">
                                <div className="absolute top-0 w-full h-1 bg-emerald-500"></div>
                                <span className="inline-flex items-center justify-center px-2 py-0.5 mb-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded-full">
                                    ADMIN
                                </span>
                                <h2 className="text-sm font-black mb-2 tracking-wider text-emerald-900">APP MESERO</h2>
                                
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-emerald-100">
                                    <QRCodeSVG value={`${baseUrl}/?mesero=true`} size={110} level="M" includeMargin={true} fgColor="#047857" />
                                </div>
                                <p className="mt-2 text-[10px] text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded truncate w-full">{`${baseUrl}/?mesero=true`}</p>
                                <p className="mt-1.5 text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                                     Toma de Pedidos
                                </p>
                            </div>

                            {/* QR COCINA */}
                            <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md print:shadow-none print:border print:border-dashed print:p-2 print:break-inside-avoid">
                                <div className="absolute top-0 w-full h-1 bg-blue-500"></div>
                                <span className="inline-flex items-center justify-center px-2 py-0.5 mb-2 text-[10px] font-bold text-blue-800 bg-blue-100 rounded-full">
                                    INTERNO
                                </span>
                                <h2 className="text-sm font-black mb-2 tracking-wider text-blue-900">KDS COCINA</h2>
                                
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-blue-100">
                                    <QRCodeSVG value={`${baseUrl}/?cocina=true`} size={110} level="M" includeMargin={true} fgColor="#1d4ed8" />
                                </div>
                                <p className="mt-2 text-[10px] text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded truncate w-full">{`${baseUrl}/?cocina=true`}</p>
                                <p className="mt-1.5 text-[11px] font-bold text-blue-700 flex items-center justify-center gap-1">
                                    Órdenes
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* SECCIÓN CLIENTES (Mesas) */}
                    <section>
                        <div className="flex items-center gap-3 mb-4 print:hidden">
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest pl-3 border-l-4 border-orange-500">Menú Clientes</h2>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-5 print:gap-2">
                            {tables.map(num => (
                                <div key={num} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-orange-200 print:shadow-none print:border print:border-dashed print:p-2 print:break-inside-avoid hover:-translate-y-1">
                                    <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center font-black text-sm mb-2 shadow-sm border border-white ring-1 ring-orange-100">
                                        {num}
                                    </div>
                                    <h2 className="text-sm font-bold mb-2 uppercase tracking-widest text-gray-800">Mesa {num}</h2>
                                    
                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100 mb-2">
                                        <QRCodeSVG value={`${baseUrl}/?mesa=${num}`} size={110} level="M" includeMargin={true} fgColor="#1f2937" />
                                    </div>
                                    
                                    <div className="w-full bg-orange-50 py-1 rounded shadow-sm border border-orange-100">
                                        <p className="text-[10px] font-extrabold text-orange-600 tracking-wide">ESCANEA Y ORDENA</p>
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
