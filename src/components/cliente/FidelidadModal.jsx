import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

/**
 * FidelidadModal.jsx — Modal de Bootstrap 5 integrado con React
 *
 * Se muestra automáticamente al montar el componente.
 * Llama a onContinue() cuando el usuario pasa al menú.
 *
 * Props:
 *   onContinue — callback cuando el usuario presiona "Continuar al Menú"
 */
const FidelidadModal = ({ onContinue }) => {
    const modalRef = useRef(null);
    const bsModalRef = useRef(null);

    useEffect(() => {
        // Crear instancia de Bootstrap Modal
        bsModalRef.current = new Modal(modalRef.current, {
            backdrop: 'static',   // No se cierra clickando fuera
            keyboard: false,       // No se cierra con Escape
        });

        // Mostrar automáticamente al montar
        bsModalRef.current.show();

        // Cleanup al desmontar
        return () => {
            bsModalRef.current?.hide();
        };
    }, []);

    const handleContinue = () => {
        bsModalRef.current?.hide();
        onContinue();
    };

    const handleDownload = () => {
        // Acción futura: redirigir a tienda de apps
        alert('¡Próximamente disponible en App Store y Google Play!');
    };

    return (
        <div
            className="modal fade"
            ref={modalRef}
            tabIndex="-1"
            aria-labelledby="fidelidadModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '1.25rem' }}>

                    {/* Header con gradiente naranja */}
                    <div
                        className="modal-header border-0 text-white p-4 pb-5"
                        style={{ background: 'linear-gradient(135deg, #FF7A00, #E06900)' }}
                    >
                        <div className="text-center w-100">
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)' }}
                            >
                                <span style={{ fontSize: 36 }}>⭐</span>
                            </div>
                            <h4 className="modal-title fw-bold mb-1" id="fidelidadModalLabel">
                                ¡Acumula Puntos!
                            </h4>
                            <p className="mb-0 opacity-75 small">
                                Programa de fidelidad exclusivo para clientes
                            </p>
                        </div>
                    </div>

                    {/* Body con contenido de beneficios */}
                    <div className="modal-body px-4 pt-4 pb-3" style={{ marginTop: '-1.5rem' }}>
                        {/* Card superpuesta al header */}
                        <div
                            className="card border-0 shadow-sm mb-4"
                            style={{ borderRadius: '1rem', marginTop: '-2rem', position: 'relative', zIndex: 1 }}
                        >
                            <div className="card-body p-3">
                                <h6 className="fw-bold text-dark mb-3">Con la App obtienes:</h6>
                                <ul className="list-unstyled mb-0">
                                    {[
                                        { icon: '🎁', text: '1 punto por cada $10 consumidos' },
                                        { icon: '🍕', text: 'Platillo gratis al acumular 100 pts' },
                                        { icon: '📱', text: 'Ordena desde tu celular' },
                                        { icon: '🔔', text: 'Notificaciones de promociones' },
                                    ].map((item, idx) => (
                                        <li key={idx} className="d-flex align-items-center gap-2 py-1">
                                            <span style={{ fontSize: 20, minWidth: 28 }}>{item.icon}</span>
                                            <span className="text-secondary small">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Badges de tiendas */}
                        <p className="text-center text-muted small mb-3">
                            Disponible próximamente en:
                        </p>
                        <div className="d-flex justify-content-center gap-3 mb-1">
                            <span className="badge bg-dark px-3 py-2 d-flex align-items-center gap-1">
                                <span>🍎</span> App Store
                            </span>
                            <span className="badge bg-dark px-3 py-2 d-flex align-items-center gap-1">
                                <span>🤖</span> Google Play
                            </span>
                        </div>
                    </div>

                    {/* Footer con dos botones */}
                    <div className="modal-footer border-0 px-4 pb-4 d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary flex-fill py-2"
                            onClick={handleDownload}
                            style={{ borderRadius: '0.75rem' }}
                        >
                            📲 Descargar App
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary flex-fill py-2 fw-bold"
                            onClick={handleContinue}
                            style={{ borderRadius: '0.75rem' }}
                        >
                            Continuar al Menú →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FidelidadModal;
