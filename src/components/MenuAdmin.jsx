import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

// ─── Categorías disponibles (puedes ajustar IDs según tu BD) ─────────────────
const CATEGORIAS = [
    { id: 1, nombre: 'Hamburguesas' },
    { id: 2, nombre: 'Pizzas' },
    { id: 3, nombre: 'Bebidas' },
    { id: 4, nombre: 'Postres' },
    { id: 5, nombre: 'Ensaladas' },
];
const COCINAS = [
    { id: 1, nombre: 'Parrilla' },
    { id: 2, nombre: 'Bebidas' },
    { id: 3, nombre: 'Repostería' },
];
const MESAS_OPCIONES = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, nombre: `Mesa ${i + 1}` }));

const ROL_BADGE = {
    admin: { color: '#6f42c1', label: '🛡️ Admin' },
    chef: { color: '#fd7e14', label: '👨‍🍳 Chef' },
    mesero: { color: '#0d6efd', label: '🧑‍🍽️ Mesero' },
};

// ─── Modal de usuario (crear / editar) ───────────────────────────────────────
const EMPTY_USER = { nombre: '', email: '', password: '', rol: 'mesero', kitchen_id: '', mesa_id: '' };

const UsuarioModal = ({ usuario, onSave, onClose, saving }) => {
    const isNew = !usuario?.id;
    const [form, setForm] = useState(usuario ? {
        nombre: usuario.nombre, email: usuario.email, password: '',
        rol: usuario.rol, kitchen_id: usuario.kitchen_id || '', mesa_id: usuario.mesa_id || ''
    } : EMPTY_USER);
    const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? '➕ Nuevo Empleado' : '✏️ Editar Empleado'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Nombre completo *</label>
                            <input className="form-control" value={form.nombre}
                                onChange={e => set('nombre', e.target.value)} placeholder="Ej. Juan Pérez" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Correo electrónico *</label>
                            <input className="form-control" type="email" value={form.email}
                                onChange={e => set('email', e.target.value)} placeholder="empleado@rest.com" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">
                                Contraseña {!isNew && <span className="text-muted">(dejar vacío para no cambiar)</span>}
                            </label>
                            <input className="form-control" type="password" value={form.password}
                                onChange={e => set('password', e.target.value)}
                                placeholder={isNew ? 'Mínimo 6 caracteres' : '••••••'} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Rol *</label>
                            <select className="form-select" value={form.rol}
                                onChange={e => set('rol', e.target.value)}>
                                <option value="mesero">🧑‍🍽️ Mesero</option>
                                <option value="chef">👨‍🍳 Chef</option>
                                <option value="admin">🛡️ Administrador</option>
                            </select>
                        </div>
                        {/* Asignación según rol */}
                        {form.rol === 'chef' && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">🍳 Cocina asignada</label>
                                <select className="form-select" value={form.kitchen_id}
                                    onChange={e => set('kitchen_id', Number(e.target.value))}>
                                    <option value="">— Sin asignar —</option>
                                    {COCINAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                        )}
                        {form.rol === 'mesero' && (
                            <div className="mb-3">
                                <label className="form-label fw-semibold small">🪑 Mesa asignada</label>
                                <select className="form-select" value={form.mesa_id}
                                    onChange={e => set('mesa_id', Number(e.target.value))}>
                                    <option value="">— Sin asignar —</option>
                                    {MESAS_OPCIONES.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button
                            className="btn btn-primary fw-bold px-4"
                            style={{ borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={saving || !form.nombre || !form.email}
                        >
                            {saving
                                ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                                : isNew ? '➕ Crear' : '💾 Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Vista Personal ───────────────────────────────────────────────────────────
const PersonalAdmin = ({ mostrarToast }) => {
    const { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario } = useAppStore();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);   // null | {} | {id,...}
    const [saving, setSaving] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);

    const cargar = async () => {
        setLoading(true);
        try { setUsuarios(await fetchUsuarios()); } finally { setLoading(false); }
    };

    useEffect(() => { cargar(); }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const payload = {
                nombre: form.nombre, email: form.email,
                password: form.password || undefined,
                rol: form.rol,
                kitchen_id: form.rol === 'chef' ? (form.kitchen_id || null) : null,
                mesa_id: form.rol === 'mesero' ? (form.mesa_id || null) : null,
            };
            if (modal?.id) await updateUsuario(modal.id, payload);
            else await createUsuario(payload);
            mostrarToast(modal?.id ? '✅ Empleado actualizado' : '✅ Empleado creado');
            await cargar();
            setModal(null);
        } catch (e) {
            mostrarToast('❌ ' + (e.message || 'Error al guardar'));
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUsuario(id);
            mostrarToast('🗑️ Empleado eliminado');
            await cargar();
        } catch { mostrarToast('❌ No se pudo eliminar'); }
        setConfirmDel(null);
    };

    const getNombreCocina = (id) => COCINAS.find(c => c.id === id)?.nombre || `Cocina ${id}`;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    Personal <span className="badge bg-secondary ms-2">{usuarios.length}</span>
                </h2>
                <button className="btn btn-primary fw-bold" style={{ borderRadius: '2rem' }}
                    onClick={() => setModal({})}>
                    ➕ Nuevo Empleado
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : (
                <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                    <table className="table table-hover mb-0">
                        <thead style={{ background: '#f0f0f8' }}>
                            <tr>
                                <th className="ps-4">Empleado</th>
                                <th>Rol</th>
                                <th>Asignación</th>
                                <th>Estado</th>
                                <th className="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => {
                                const badge = ROL_BADGE[u.rol] || { color: '#aaa', label: u.rol };
                                return (
                                    <tr key={u.id}>
                                        <td className="ps-4">
                                            <div className="fw-semibold">{u.nombre}</div>
                                            <div className="text-muted small">{u.email}</div>
                                        </td>
                                        <td>
                                            <span className="badge fw-semibold"
                                                style={{ background: badge.color, borderRadius: '2rem', fontSize: '0.8rem' }}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="text-muted small">
                                            {u.rol === 'chef' && u.kitchen_id && <>🍳 {getNombreCocina(u.kitchen_id)}</>}
                                            {u.rol === 'mesero' && u.mesa_id && <>🪑 Mesa {u.mesa_id}</>}
                                            {(!u.kitchen_id && !u.mesa_id) && <em>Sin asignar</em>}
                                        </td>
                                        <td>
                                            <span className={`badge ${u.activo ? 'bg-success' : 'bg-secondary'}`}>
                                                {u.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-primary me-2"
                                                style={{ borderRadius: '0.5rem' }}
                                                onClick={() => setModal(u)}>
                                                ✏️ Editar
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger"
                                                style={{ borderRadius: '0.5rem' }}
                                                onClick={() => setConfirmDel(u)}>
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {usuarios.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">Sin empleados registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {modal !== null && (
                <UsuarioModal usuario={modal?.id ? modal : null}
                    onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
            )}

            {/* Confirmación de eliminación */}
            {confirmDel && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg text-center p-4" style={{ borderRadius: '1.25rem' }}>
                            <p style={{ fontSize: 40 }}>⚠️</p>
                            <h5 className="fw-bold">¿Eliminar empleado?</h5>
                            <p className="text-muted small mb-3">{confirmDel.nombre}</p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
                                <button className="btn btn-danger fw-bold" onClick={() => handleDelete(confirmDel.id)}>
                                    Sí, eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Utilidad para obtener color por nombre de categoría ────────────────────
const getCategoryColor = (categoriaNombre) => {
    if (!categoriaNombre || categoriaNombre === 'Otros' || categoriaNombre === 'Todos') return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    
    // Hash simple basado en string para color consistente
    let hash = 0;
    for (let i = 0; i < categoriaNombre.length; i++) hash = categoriaNombre.charCodeAt(i) + ((hash << 5) - hash);
    
    const colors = [
        { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }, // Red
        { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' }, // Orange
        { bg: '#fef3c7', text: '#92400e', border: '#fde68a' }, // Amber
        { bg: '#ecfccb', text: '#3f6212', border: '#d9f99d' }, // Lime
        { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' }, // Green
        { bg: '#e0f2fe', text: '#075985', border: '#bae6fd' }, // Sky
        { bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' }, // Violet
        { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' }, // Pink
    ];
    
    return colors[Math.abs(hash) % colors.length];
};

// ─── Componente tarjeta de producto ──────────────────────────────────────────
const ProductCard = ({ product, onEdit }) => {
    const stockBajo = product.stock_disponible != null && product.stock_disponible <= 3;
    const catColor = getCategoryColor(product.categoria);

    return (
        <div className="card shadow-sm h-100 border-0" style={{ borderRadius: '1.25rem', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => onEdit(product)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            {/* Imagen */}
            <div style={{ height: 150, background: '#f8fafc', overflow: 'hidden', position: 'relative' }}>
                {product.imagen_url
                    ? <img src={product.imagen_url} alt={product.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div className="d-flex align-items-center justify-content-center h-100 text-slate-300" style={{ fontSize: 48 }}>🍽️</div>
                }
                <div className="position-absolute top-0 w-100 d-flex justify-content-between p-2">
                    <span 
                        className="badge" 
                        style={{ 
                            backgroundColor: catColor.bg, 
                            color: catColor.text,
                            border: `1px solid ${catColor.border}`,
                            borderRadius: '1rem',
                            padding: '0.4em 0.8em',
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}
                    >
                        {product.categoria || 'Sin Categoría'}
                    </span>
                    {stockBajo && (
                        <span className="badge bg-danger shadow-sm px-2 py-1" style={{ borderRadius: '1rem' }}>
                            <span className="me-1">⚠️</span> Stock: {product.stock_disponible}
                        </span>
                    )}
                </div>
            </div>
            {/* Info */}
            <div className="card-body d-flex flex-column p-3 bg-white">
                <h6 className="fw-bolder mb-1 text-dark" style={{ fontSize: '1.05rem', lineHeight: '1.3' }}>{product.nombre}</h6>
                <p className="text-secondary small mb-3" style={{
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    fontSize: '0.85rem'
                }}>
                    {product.descripcion || <em>Sin descripción detallada</em>}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-end">
                    <span className="fw-black fs-5" style={{ color: '#0f172a' }}>
                        ${Number(product.precio).toFixed(2)}
                    </span>
                    <button
                        className="btn btn-light btn-sm fw-bold border"
                        style={{ borderRadius: '0.75rem', color: '#334155' }}
                        onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                    >
                        Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Modal de edición / creación ─────────────────────────────────────────────
const ProductModal = ({ product, onSave, onClose, saving }) => {
    const isNew = !product?.id;
    const [form, setForm] = useState(product || EMPTY_NEW);
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    return (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1.25rem' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            {isNew ? '➕ Nuevo Platillo' : '✏️ Editar Platillo'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>
                    <div className="modal-body pt-2">
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Nombre *</label>
                            <input className="form-control" value={form.nombre}
                                onChange={e => set('nombre', e.target.value)}
                                placeholder="Ej. Hamburguesa Doble" />
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Precio ($) *</label>
                                <input className="form-control" type="number" step="0.01" value={form.precio}
                                    onChange={e => set('precio', e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Stock disponible</label>
                                <input className="form-control" type="number" value={form.stock_disponible}
                                    onChange={e => set('stock_disponible', e.target.value)} />
                            </div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Categoría</label>
                                <select className="form-select" value={form.categoria_id}
                                    onChange={e => set('categoria_id', Number(e.target.value))}>
                                    {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-semibold small">Cocina</label>
                                <select className="form-select" value={form.kitchen_id}
                                    onChange={e => set('kitchen_id', Number(e.target.value))}>
                                    {COCINAS.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold small">Descripción</label>
                            <textarea className="form-control" rows="2" value={form.descripcion}
                                onChange={e => set('descripcion', e.target.value)}
                                placeholder="Ingredientes, detalles..." />
                        </div>
                        <div className="mb-1">
                            <label className="form-label fw-semibold small">URL Imagen</label>
                            <input className="form-control form-control-sm" value={form.imagen_url || ''}
                                onChange={e => set('imagen_url', e.target.value)}
                                placeholder="https://..." />
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
                        <button
                            className="btn btn-primary fw-bold px-4"
                            style={{ borderRadius: '0.75rem' }}
                            onClick={() => onSave(form)}
                            disabled={saving || !form.nombre || !form.precio}
                        >
                            {saving
                                ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                                : isNew ? '➕ Crear' : '💾 Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Panel principal Admin ────────────────────────────────────────────────────
const MenuAdmin = () => {
    const { products, updateProduct, createProduct, fetchAdminProducts } = useAppStore();
    const [modalProduct, setModalProduct] = useState(null);   // null=cerrado, {}=nuevo, {...}=editar
    const [saving, setSaving] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');
    const [toast, setToast] = useState('');
    const [vistaActual, setVistaActual] = useState('menu'); // 'menu' | 'personal' | 'qr'


    useEffect(() => { fetchAdminProducts(); }, []);

    const mostrarToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (form.id) {
                await updateProduct(form.id, {
                    nombre: form.nombre, precio: parseFloat(form.precio),
                    descripcion: form.descripcion,
                    stock_disponible: parseInt(form.stock_disponible, 10),
                });
                mostrarToast('✅ Producto actualizado');
            } else {
                await createProduct({
                    nombre: form.nombre, precio: parseFloat(form.precio),
                    descripcion: form.descripcion,
                    categoria_id: form.categoria_id, kitchen_id: form.kitchen_id,
                    stock_disponible: parseInt(form.stock_disponible, 10) || 0,
                    imagen_url: form.imagen_url || null,
                });
                mostrarToast('✅ Producto creado');
            }
            await fetchAdminProducts();
            setModalProduct(null);
        } catch (e) {
            mostrarToast('❌ Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    // Filtros
    const categorias = ['Todos', ...new Set(products.map(p => p.categoria || 'Otros'))];
    const productsFiltrados = products.filter(p => {
        const coincideCat = filtroCategoria === 'Todos' || (p.categoria || 'Otros') === filtroCategoria;
        const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideCat && coincideBusqueda;
    });

    return (
        <div className="min-vh-100" style={{ background: '#f4f6fb' }}>

            {/* ── Sidebar / Topbar ──────────────────────────────── */}
            <nav className="navbar sticky-top shadow-sm px-3 py-2"
                style={{ background: 'linear-gradient(90deg,#1a1a2e,#0f3460)', borderBottom: '3px solid #e67e22' }}>
                <div className="d-flex align-items-center gap-3 me-auto">
                    <span style={{ fontSize: 26 }}>🍴</span>
                    <span className="fw-bold text-white fs-5">Panel Administrador</span>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className={`btn btn-sm ${vistaActual === 'menu' ? 'btn-warning text-dark' : 'btn-outline-light'} fw-semibold`}
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setVistaActual('menu')}
                    >🍽️ Menú</button>
                    <button
                        className={`btn btn-sm ${vistaActual === 'personal' ? 'btn-warning text-dark' : 'btn-outline-light'} fw-semibold`}
                        style={{ borderRadius: '2rem' }}
                        onClick={() => setVistaActual('personal')}
                    >👥 Personal</button>
                    <button
                        className={`btn btn-sm ${vistaActual === 'qr' ? 'btn-warning text-dark' : 'btn-outline-light'} fw-semibold`}
                        style={{ borderRadius: '2rem' }}
                        onClick={() => { setVistaActual('qr'); window.open('?admin=qr', '_blank'); }}
                    >🖨️ QRs</button>
                </div>
            </nav>

            <div className="container-fluid px-4 py-4">
                {vistaActual === 'personal' ? (
                    <PersonalAdmin mostrarToast={mostrarToast} />
                ) : (
                    <>
                        {/* ── Barra de herramientas ──────────────────────── */}
                        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                            <h2 className="fw-bold mb-0 me-auto">
                                Gestión del Menú
                                <span className="badge bg-secondary ms-2 fs-6">{products.length} productos</span>
                            </h2>
                            <input
                                className="form-control form-control-sm"
                                style={{ maxWidth: 220, borderRadius: '2rem' }}
                                placeholder="🔍 Buscar platillo..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            <button
                                className="btn btn-primary fw-bold"
                                style={{ borderRadius: '2rem' }}
                                onClick={() => setModalProduct({})}
                            >
                                ➕ Nuevo Platillo
                            </button>
                        </div>

                        <div className="d-flex gap-2 flex-wrap mb-4 pb-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            {categorias.map(cat => {
                                const cColor = getCategoryColor(cat);
                                const isSelected = filtroCategoria === cat;
                                return (
                                    <button key={cat}
                                        className="btn btn-sm shadow-sm transition-all fw-bold px-3 py-1"
                                        style={{ 
                                            borderRadius: '2rem',
                                            backgroundColor: isSelected ? '#0f172a' : cColor.bg,
                                            color: isSelected ? '#ffffff' : cColor.text,
                                            border: `1px solid ${isSelected ? '#0f172a' : cColor.border}`,
                                            transform: isSelected ? 'scale(1.05)' : 'none'
                                        }}
                                        onClick={() => setFiltroCategoria(cat)}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── Grid de productos ──────────────────────────── */}
                        {productsFiltrados.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <p style={{ fontSize: 48 }}>🍽️</p>
                                <p className="fw-semibold">Sin productos que mostrar</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {productsFiltrados.map(p => (
                                    <div key={p.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                                        <ProductCard product={p} onEdit={setModalProduct} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Modal ─────────────────────────────────────────── */}
            {modalProduct !== null && (
                <ProductModal
                    product={modalProduct?.id ? modalProduct : null}
                    onSave={handleSave}
                    onClose={() => setModalProduct(null)}
                    saving={saving}
                />
            )}

            {/* ── Toast de confirmación ─────────────────────────── */}
            {toast && (
                <div
                    className="position-fixed bottom-0 end-0 m-4 alert alert-dark shadow-lg fw-semibold"
                    style={{ borderRadius: '1rem', zIndex: 9999, minWidth: 220 }}
                >
                    {toast}
                </div>
            )}
        </div>
    );
};

export default MenuAdmin;
