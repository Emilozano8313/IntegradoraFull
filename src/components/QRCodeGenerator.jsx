import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Using SVG for better print quality

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
        <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
            <div className="max-w-4xl mx-auto print:max-w-none">
                <header className="mb-8 flex justify-between items-start print:hidden">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generador de QRs</h1>
                        <div className="flex items-center gap-2">
                            <label className="text-gray-500 font-medium">Base URL:</label>
                            <input
                                type="text"
                                value={baseUrl}
                                onChange={handleUrlChange}
                                className="bg-white border border-gray-300 px-3 py-1 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-80"
                                placeholder="https://ejemplo.com"
                            />
                            <button
                                onClick={resetUrl}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Reset
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Edita esto con la IP de tu red (ej. 192.168.1.50:5173) para que funcione en móviles.
                        </p>
                    </div>
                    <button
                        onClick={printPage}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-700"
                    >
                        Imprimir QRs
                    </button>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 print:grid-cols-2 print:gap-4">
                    {/* QR MESA 1-10 */}
                    {tables.map(num => (
                        <div key={num} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center text-center print:shadow-none print:border-2 print:border-dashed print:p-4 print:break-inside-avoid">
                            <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest text-gray-800">Mesa {num}</h2>
                            <QRCodeSVG
                                value={`${baseUrl}/?mesa=${num}`}
                                size={200}
                                level="H" // High error correction
                                includeMargin={true}
                            />
                            <p className="mt-2 text-xs text-gray-400 font-mono">{`${baseUrl}/?mesa=${num}`}</p>
                            <p className="mt-4 text-sm font-semibold text-orange-600">Escanea para ordenar</p>
                        </div>
                    ))}

                    {/* QR COCINA */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center text-center print:shadow-none print:border-2 print:border-dashed print:p-4 print:break-inside-avoid border-blue-200 bg-blue-50">
                        <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest text-blue-800">Cocina</h2>
                        <QRCodeSVG
                            value={`${baseUrl}/?cocina=true`}
                            size={200}
                            level="H"
                            includeMargin={true}
                            fgColor="#1e40af" // Blue QR for kitchen
                        />
                        <p className="mt-2 text-xs text-gray-400 font-mono">{`${baseUrl}/?cocina=true`}</p>
                        <p className="mt-4 text-sm font-semibold text-blue-600">Acceso Personal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRGenerator;
