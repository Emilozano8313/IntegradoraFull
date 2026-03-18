import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

/**
 * ProductCard.jsx — Tarjeta de producto para el menú del cliente
 *
 * Props:
 *   product — objeto con { id, nombre, descripcion, alergenos, precio,
 *                          stock_disponible, imagen_url, categoria, cocina }
 */
const ProductCard = ({ product }) => {
    const { carrito, agregarAlCarrito, decrementarCantidad } = useAppStore();
    const [added, setAdded] = useState(false);

    // Buscar si el producto ya está en el carrito
    const itemEnCarrito = carrito.find(i => i.id === product.id);
    const cantidad = itemEnCarrito?.cantidad || 0;

    const handleAgregar = () => {
        agregarAlCarrito(product);
        // Feedback visual breve
        setAdded(true);
        setTimeout(() => setAdded(false), 800);
    };

    const sinStock = product.stock_disponible === 0;
    const stockBajo = product.stock_disponible > 0 && product.stock_disponible <= 5;

    return (
        <div className={`card h-100 border-0 shadow-sm kds-ticket ${sinStock ? 'opacity-60' : ''}`}
            style={{ borderRadius: '1rem', overflow: 'hidden' }}>

            {/* Imagen / Placeholder */}
            <div
                className="position-relative"
                style={{
                    height: 130,
                    background: product.imagen_url
                        ? `url(${product.imagen_url}) center/cover`
                        : 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {!product.imagen_url && (
                    <span style={{ fontSize: 48, opacity: 0.4 }}>🍽️</span>
                )}

                {/* Badge de stock */}
                {sinStock && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-danger">
                        Agotado
                    </span>
                )}
                {stockBajo && !sinStock && (
                    <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                        ¡Últimos {product.stock_disponible}!
                    </span>
                )}
            </div>

            {/* Contenido */}
            <div className="card-body d-flex flex-column p-2 pb-3">
                <h6 className="fw-bold mb-1 lh-sm" style={{ fontSize: '0.85rem' }}>
                    {product.nombre}
                </h6>

                {product.descripcion && (
                    <p className="text-muted mb-1" style={{ fontSize: '0.72rem', lineHeight: 1.3 }}>
                        {product.descripcion.length > 55
                            ? product.descripcion.slice(0, 55) + '...'
                            : product.descripcion}
                    </p>
                )}

                {/* Alérgenos */}
                {product.alergenos && product.alergenos !== 'ninguno' && (
                    <div className="mb-2">
                        <span
                            className="badge text-bg-warning fw-normal"
                            style={{ fontSize: '0.65rem', borderRadius: '0.4rem' }}
                        >
                            ⚠️ {product.alergenos}
                        </span>
                    </div>
                )}

                <div className="mt-auto">
                    {/* Precio */}
                    <p className="fw-bold text-primary mb-2" style={{ fontSize: '1rem' }}>
                        ${Number(product.precio).toFixed(2)}
                    </p>

                    {/* Botón / Contador */}
                    {cantidad === 0 ? (
                        <button
                            className={`btn btn-primary w-100 py-1 fw-semibold ${added ? 'btn-success' : ''}`}
                            style={{ borderRadius: '0.6rem', fontSize: '0.8rem', transition: 'all 0.3s' }}
                            onClick={handleAgregar}
                            disabled={sinStock}
                        >
                            {added ? '✓ Agregado' : sinStock ? 'Agotado' : '+ Agregar'}
                        </button>
                    ) : (
                        <div className="d-flex align-items-center justify-content-between bg-light rounded-pill px-2">
                            <button
                                className="btn btn-sm p-0 fw-bold fs-5 text-danger border-0 bg-transparent"
                                style={{ width: 32, height: 32 }}
                                onClick={() => decrementarCantidad(product.id)}
                            >
                                −
                            </button>
                            <span className="fw-bold text-primary">{cantidad}</span>
                            <button
                                className="btn btn-sm p-0 fw-bold fs-5 text-primary border-0 bg-transparent"
                                style={{ width: 32, height: 32 }}
                                onClick={handleAgregar}
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
