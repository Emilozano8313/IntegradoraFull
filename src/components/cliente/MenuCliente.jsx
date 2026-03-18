import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ProductCard from './ProductCard';

/**
 * MenuCliente.jsx — Catálogo de productos del cliente
 *
 * Muestra productos por categoría con tabs. Filtrables.
 * Incluye botón flotante del carrito.
 *
 * Props:
 *   numeroMesa  — número de mesa actual
 *   onVerCarrito — callback para navegar al carrito
 */
const MenuCliente = ({ numeroMesa, onVerCarrito }) => {
    const { products, loadingProducts, carrito } = useAppStore();
    const [categoriaActiva, setCategoriaActiva] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    // Derivar categorías únicas de los productos
    const categorias = useMemo(() => {
        const cats = [...new Set(products.map(p => p.categoria))].sort();
        return ['todos', ...cats];
    }, [products]);

    // Filtrar por categoría y búsqueda
    const productosFiltrados = useMemo(() => {
        let lista = products;
        if (categoriaActiva !== 'todos') {
            lista = lista.filter(p => p.categoria === categoriaActiva);
        }
        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();
            lista = lista.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                p.descripcion?.toLowerCase().includes(q)
            );
        }
        return lista;
    }, [products, categoriaActiva, busqueda]);

    // Total de items en el carrito
    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    if (loadingProducts) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3">
                <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} role="status" />
                <p className="text-muted fw-semibold">Cargando menú...</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100" style={{ paddingBottom: totalItems > 0 ? 90 : 16 }}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <header
                className="sticky-top text-white px-3 pt-3 pb-0"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #E06900)', zIndex: 50 }}
            >
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                        <span className="badge bg-white text-primary fw-bold px-2 py-1 small mb-1 d-block" style={{ width: 'fit-content' }}>
                            Mesa #{numeroMesa}
                        </span>
                        <h1 className="fs-5 fw-bold mb-0 text-white">Nuestro Menú</h1>
                    </div>
                    <span style={{ fontSize: 32 }}>🍽️</span>
                </div>

                {/* Buscador */}
                <div className="position-relative mb-3">
                    <span className="position-absolute top-50 translate-middle-y ms-2" style={{ left: 8, zIndex: 1 }}>
                        🔍
                    </span>
                    <input
                        type="search"
                        className="form-control bg-white border-0 shadow-sm ps-5"
                        placeholder="Buscar platillo o bebida..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ borderRadius: '2rem', height: 42 }}
                    />
                </div>

                {/* Tabs de categorías */}
                <div className="d-flex gap-2 overflow-auto pb-3" style={{ scrollbarWidth: 'none' }}>
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={`btn btn-sm flex-shrink-0 fw-semibold ${categoriaActiva === cat
                                ? 'btn-light text-primary'
                                : 'text-white border-white border-opacity-50'
                                }`}
                            style={{ borderRadius: '2rem', minWidth: 80 }}
                            onClick={() => setCategoriaActiva(cat)}
                        >
                            {cat === 'todos' ? '🍴 Todo' : cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Grid de productos ────────────────────────────────────── */}
            <main className="flex-grow-1 p-3">
                {productosFiltrados.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <p style={{ fontSize: 48 }}>🔍</p>
                        <p className="fw-semibold">Sin resultados para "{busqueda}"</p>
                        <button
                            className="btn btn-link text-primary"
                            onClick={() => { setBusqueda(''); setCategoriaActiva('todos'); }}
                        >
                            Ver todo el menú
                        </button>
                    </div>
                ) : (
                    <div className="row g-3">
                        {productosFiltrados.map(product => (
                            <div key={product.id} className="col-6 col-sm-4 col-lg-3">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── Barra flotante del carrito ───────────────────────────── */}
            {totalItems > 0 && (
                <div className="cart-footer-bar">
                    <button
                        className="btn btn-primary w-100 fw-bold py-3 d-flex align-items-center justify-content-between"
                        style={{ borderRadius: '0.75rem' }}
                        onClick={onVerCarrito}
                    >
                        <span className="badge bg-white text-primary rounded-circle" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            {totalItems}
                        </span>
                        <span>Ver mi pedido</span>
                        <span className="fw-bold">${totalPrecio.toFixed(2)}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuCliente;
