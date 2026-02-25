import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore'

export const useAppStore = create(
    persist(
        (set) => ({
            numeroMesa: null,
            carrito: [],
            numeroMesa: null,
            carrito: [],
            orders: [], // Sincronizado con Firestore
            products: [], // Sincronizado con Firestore
            loadingProducts: true,

            setNumeroMesa: (numero) => set({ numeroMesa: numero }),

            // --- LISTENERS FIREBASE ---
            initializeProductsListener: () => {
                const unsubscribe = onSnapshot(collection(db, "productos"), (snapshot) => {
                    const firestoreProducts = snapshot.docs.map(doc => ({
                        id: doc.id, // ID documento es string, el ID mock era numero. Ajustar si necesario.
                        ...doc.data()
                    }));
                    // Si no hay productos (primera vez), se mantiene array vacio
                    set({ products: firestoreProducts, loadingProducts: false });
                    console.log("Productos sincronizados:", firestoreProducts);
                }, (error) => {
                    console.error("Error obteniendo productos:", error);
                    set({ loadingProducts: false });
                });
                return unsubscribe;
            },

            // --- ACCIONES ADMIN MENÚ ---
            seedDatabase: async (mockProducts) => {
                try {
                    const batchPromises = mockProducts.map(p => {
                        // Usar el ID numérico como ID de documento para mantener consistencia simple
                        // o dejar que Firestore genere ID. Para facilitar, usaremos Firestore ID y guardamos id numérico como campo legacy si es necesario.
                        const { id, ...data } = p;
                        return addDoc(collection(db, "productos"), data);
                    });
                    await Promise.all(batchPromises);
                    alert("Base de datos poblada con productos iniciales!");
                } catch (e) {
                    console.error("Error seeding DB:", e);
                }
            },

            updateProduct: async (id, data) => {
                try {
                    const ref = doc(db, "productos", id);
                    await updateDoc(ref, data);
                    // No necesitas set local, el listener escucha el cambio
                } catch (e) {
                    console.error("Error updating product:", e);
                    alert("Error guardando cambios");
                }
            },

            createProduct: async (productData) => {
                try {
                    await addDoc(collection(db, "productos"), productData);
                    alert("Producto agregado correctamente");
                } catch (e) {
                    console.error("Error creating product:", e);
                    alert("Error al crear producto");
                }
            },

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
                carrito: state.carrito.filter((item) => item.id !== productoId)
            })),

            actualizarNotaItem: (productoId, nota) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, notas: nota } : item
                )
            })),

            incrementarCantidad: (productoId) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
                )
            })),

            decrementarCantidad: (productoId) => set((state) => ({
                carrito: state.carrito.map((item) =>
                    item.id === productoId && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
                )
            })),

            limpiarCarrito: () => set({ carrito: [] }),

            // --- ACCIONES FIREBASE ---

            // Inicializar Escucha en Tiempo Real (Solo se llama una vez al montar app/dashboard)
            initializeOrdersListener: () => {
                const unsubscribe = onSnapshot(collection(db, "ordenes"), (snapshot) => {
                    const firestoreOrders = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    set({ orders: firestoreOrders });
                    console.log("Órdenes sincronizadas desde Firebase:", firestoreOrders);
                }, (error) => {
                    console.error("Error escuchando órdenes:", error);
                });
                return unsubscribe;
            },

            // Enviar Orden a Firestore
            addOrder: async (order) => {
                try {
                    const docRef = await addDoc(collection(db, "ordenes"), {
                        ...order,
                        estado: 'pendiente' // Asegurar estado inicial
                    });
                    console.log("Orden enviada con ID: ", docRef.id);
                    // No necesitamos actualizar el estado local 'orders' manualmente, 
                    // el listener de initializeOrdersListener lo hará automáticamente.
                } catch (e) {
                    console.error("Error al enviar orden: ", e);
                    alert("Error enviando pedido. Intenta de nuevo.");
                }
            },

            // Actualizar Estado en Firestore
            updateOrderStatus: async (orderId, newStatus) => {
                try {
                    const orderRef = doc(db, "ordenes", orderId);
                    await updateDoc(orderRef, { estado: newStatus });
                } catch (e) {
                    console.error("Error actualizando estado:", e);
                }
            },

            // Cancelar Orden en Firestore
            cancelOrder: async (orderId, reason) => {
                try {
                    const orderRef = doc(db, "ordenes", orderId);
                    await updateDoc(orderRef, {
                        estado: 'cancelada',
                        motivo_cancelacion: reason
                    });
                } catch (e) {
                    console.error("Error cancelando orden:", e);
                }
            },
        }),
        {
            name: 'restaurant-storage',
            partialize: (state) => ({
                // Solo persistimos lo local que NO viene de Firebase
                // orders ya no se persiste porque viene "live" de Firestore
                numeroMesa: state.numeroMesa,
                carrito: state.carrito
            }),
        }
    )
)
