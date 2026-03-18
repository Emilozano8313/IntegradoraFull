import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── URL base de la API — dinámica según el host que abre la app ───────────────
// localhost:8080  → cuando se abre desde la misma máquina
// 192.168.X.X:8080 → cuando un celular escanea el QR en la red local
const API_URL = import.meta.env.VITE_API_URL
    || `http://${window.location.hostname}:8080/api`;

/**
 * Helper para llamadas fetch a la API Spring Boot.
 * - Lanza Error si el servidor responde con status >= 400.
 * - Si recibe 401 o 403, dispara el evento global 'session-expired'
 *   para que los dashboards de staff redirijan al login.
 */
async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        ...options,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        // Sesión vencida → notificar a los componentes de staff
        if (res.status === 401 || res.status === 403) {
            window.dispatchEvent(new CustomEvent('session-expired'));
        }
        const err = new Error(data.error || `Error ${res.status}`);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

// ─────────────────────────────────────────────────────────────────────────────
export const useAppStore = create(
    persist(
        (set, get) => ({
            // ── Estado global ─────────────────────────────────────────────
            numeroMesa: null,
            carrito: [],
            products: [],
            loadingProducts: true,
            orders: [],          // historial de órdenes del rol logueado
            ordenActual: null,        // orden activa del cliente (para polling)
            usuario: null,        // usuario de sesión (mesero/chef/admin)
            pollingInterval: null,        // ref al setInterval del tracker

            // ── Setters básicos ───────────────────────────────────────────
            setNumeroMesa: (numero) => set({ numeroMesa: numero }),

            // ── VALIDAR MESA (Cliente) ────────────────────────────────────
            /**
             * Consulta GET /api/mesas/{numero}
             * Retorna: { id, numero, estado } o lanza Error si está ocupada (409)
             */
            validarMesa: async (numero) => {
                return await apiFetch(`/mesas/${numero}`);
            },

            // ── PRODUCTOS (Menú público) ──────────────────────────────────
            /**
             * Carga los productos desde la API PHP y los guarda en el store.
             */
            fetchProducts: async () => {
                set({ loadingProducts: true });
                try {
                    const data = await apiFetch('/productos');
                    set({ products: data, loadingProducts: false });
                } catch (e) {
                    console.error('Error cargando productos:', e);
                    set({ loadingProducts: false });
                }
            },

            // ── CARRITO ───────────────────────────────────────────────────
            agregarAlCarrito: (producto) => set((state) => {
                const existe = state.carrito.find((item) => item.id === producto.id);
                if (existe) {
                    return {
                        carrito: state.carrito.map((item) =>
                            item.id === producto.id
                                ? { ...item, cantidad: item.cantidad + 1 }
                                : item
                        ),
                    };
                }
                return { carrito: [...state.carrito, { ...producto, cantidad: 1, notas: '' }] };
            }),

            eliminarDelCarrito: (productoId) => set((state) => ({
                carrito: state.carrito.filter((item) => item.id !== productoId),
            })),

            actualizarNotaItem: (productoId, nota) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, notas: nota } : item
                ),
            })),

            incrementarCantidad: (productoId) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
                ),
            })),

            decrementarCantidad: (productoId) => set((state) => {
                const existe = state.carrito.find(i => i.id === productoId);
                if (existe && existe.cantidad === 1) {
                    return { carrito: state.carrito.filter(i => i.id !== productoId) };
                }
                return {
                    carrito: state.carrito.map((item) =>
                        item.id === productoId
                            ? { ...item, cantidad: item.cantidad - 1 }
                            : item
                    )
                };
            }),

            limpiarCarrito: () => set({ carrito: [] }),

            // ─────────────────────────────────────────────────────────────
            // ENVIAR ORDEN (Cliente → API PHP)
            // ─────────────────────────────────────────────────────────────
            addOrder: async () => {
                const { carrito, numeroMesa } = get();
                if (carrito.length === 0 || !numeroMesa) return;

                const payload = {
                    mesa_numero: numeroMesa,
                    items: carrito.map((item) => ({
                        producto_id: item.id,
                        cantidad: item.cantidad,
                        nota_cliente: item.notas || '',
                    })),
                };

                const data = await apiFetch('/ordenes', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });

                // Guardamos la orden activa para el tracker
                set({ ordenActual: data });
                return data;
            },

            // ─────────────────────────────────────────────────────────────
            // POLLING — Estado de orden del cliente
            // ─────────────────────────────────────────────────────────────
            /**
             * Inicia polling cada 5 segundos consultando GET /api/ordenes/{id}
             * Actualiza ordenActual con el estado más reciente.
             */
            startOrderPolling: (ordenId) => {
                // Limpiar polling anterior si existía
                const { pollingInterval } = get();
                if (pollingInterval) clearInterval(pollingInterval);

                const interval = setInterval(async () => {
                    try {
                        const data = await apiFetch(`/ordenes/${ordenId}`);
                        set({ ordenActual: data });

                        // Detener si la orden ya fue cerrada/cancelada
                        if (['cerrada', 'cancelada', 'entregada'].includes(data.estado)) {
                            clearInterval(interval);
                            set({ pollingInterval: null });
                        }
                    } catch (e) {
                        console.error('Error en polling:', e);
                    }
                }, 5000);

                set({ pollingInterval: interval });
            },

            stopOrderPolling: () => {
                const { pollingInterval } = get();
                if (pollingInterval) {
                    clearInterval(pollingInterval);
                    set({ pollingInterval: null });
                }
            },

            // ─────────────────────────────────────────────────────────────
            // ÓRDENES — Acciones del Mesero
            // ─────────────────────────────────────────────────────────────
            fetchMeseroOrdenes: async () => {
                const data = await apiFetch('/mesero/ordenes');
                set({ orders: data });
                return data;
            },

            fetchHistorialOrdenes: async () => {
                const data = await apiFetch('/ordenes/historial');
                return data;
            },

            cambiarEstadoOrden: async (ordenId, nuevoEstado) => {
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            // Retrocompatibilidad (KDS y otros)
            fetchOrders: async () => {
                try {
                    const data = await apiFetch('/mesero/ordenes');
                    set({ orders: data });
                } catch (e) {
                    console.error('Error cargando órdenes:', e);
                }
            },

            updateOrderStatus: async (ordenId, nuevoEstado) => {
                await apiFetch(`/ordenes/${ordenId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            // ─────────────────────────────────────────────────────────────
            // KDS — Acciones del Chef
            // ─────────────────────────────────────────────────────────────
            fetchKitchenTickets: async () => {
                try {
                    const data = await apiFetch('/cocina/tickets');
                    set({ orders: data });
                } catch (e) {
                    console.error('Error cargando tickets de cocina:', e);
                }
            },

            updateDetalleEstado: async (detalleId, nuevoEstado) => {
                await apiFetch(`/detalles/${detalleId}/estado`, {
                    method: 'PUT',
                    body: JSON.stringify({ estado: nuevoEstado }),
                });
            },

            // ─────────────────────────────────────────────────────────────
            // AUTH — Login / Logout
            // ─────────────────────────────────────────────────────────────
            login: async (email, password) => {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                set({ usuario: data });
                return data;
            },

            // Cierre de sesión COMPLETO (invalida la cookie en el servidor también)
            // CUIDADO: afectará todas las pestañas/roles abiertas en el mismo navegador.
            logout: async () => {
                await apiFetch('/auth/logout', { method: 'POST' });
                set({ usuario: null, ordenActual: null, carrito: [] });
            },

            // Cierre de sesión LOCAL — solo limpia el estado de esta pestaña.
            // Úsalo en los botones "Salir" de mesero, cocina y admin para que
            // NO afecte otras pestañas con distintos roles.
            logoutLocal: () => {
                set({ usuario: null });
            },

            updateFotoPerfil: async (base64String) => {
                await apiFetch(`/auth/foto`, {
                    method: 'PUT',
                    body: JSON.stringify({ foto_perfil: base64String }),
                });
                // Refrescar el usuario para obtener la nueva foto en el store
                const { fetchCurrentUser } = get();
                await fetchCurrentUser();
            },

            fetchCurrentUser: async () => {
                // Usamos fetch directo (sin apiFetch) para que un 401 NO genere
                // error rojo en la consola — es comportamiento esperado cuando
                // no hay sesión activa, no un error real.
                try {
                    const res = await fetch(`${API_URL}/auth/me`, {
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        set({ usuario: data });
                        return data;
                    }
                    // 401/403 esperado → sin sesión activa, no error
                    set({ usuario: null });
                    return null;
                } catch {
                    // Error de red real
                    set({ usuario: null });
                    return null;
                }
            },

            // ─────────────────────────────────────────────────────────────
            // ADMIN — CRUD Productos
            // ─────────────────────────────────────────────────────────────
            fetchAdminProducts: async () => {
                const data = await apiFetch('/admin/productos');
                set({ products: data });
                return data;
            },

            updateProduct: async (id, productData) => {
                await apiFetch(`/admin/productos/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                });
            },

            createProduct: async (productData) => {
                await apiFetch('/admin/productos', {
                    method: 'POST',
                    body: JSON.stringify(productData),
                });
            },

            deleteProduct: async (id) => {
                await apiFetch(`/admin/productos/${id}`, { method: 'DELETE' });
            },

            // ─────────────────────────────────────────────────────────────
            // ADMIN — CRUD Personal (usuarios)
            // ─────────────────────────────────────────────────────────────
            fetchUsuarios: async () => {
                return await apiFetch('/admin/usuarios');
            },

            createUsuario: async (data) => {
                return await apiFetch('/admin/usuarios', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
            },

            updateUsuario: async (id, data) => {
                return await apiFetch(`/admin/usuarios/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
            },

            deleteUsuario: async (id) => {
                await apiFetch(`/admin/usuarios/${id}`, { method: 'DELETE' });
            },

            // ─────────────────────────────────────────────────────────────
            // MESERO — Cobrar mesa completa (cierra todas las órdenes)
            // ─────────────────────────────────────────────────────────────
            cobrarMesa: async (mesaNumero) => {
                return await apiFetch(`/mesero/mesas/${mesaNumero}/cobrar`, {
                    method: 'PUT',
                });
            },
        }),
        {
            name: 'restaurant-storage-v2',
            // Solo persistimos estado local — nunca datos de sesión del servidor
            partialize: (state) => ({
                numeroMesa: state.numeroMesa,
                carrito: state.carrito,
                ordenActual: state.ordenActual,
            }),
        }
    )
);
