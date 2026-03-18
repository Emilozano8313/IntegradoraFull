import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================================================
// DATOS MOCK (Simulados para la demostración Frontend-Only)
// ============================================================================
const MOCK_PRODUCTS = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne de res 150g, queso cheddar, lechuga, tomate y aderezo de la casa.",
    precio: 120.00,
    categoria_id: 1,
    imagen_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    activo: true,
  },
  {
    id: 2,
    nombre: "Pizza Pepperoni",
    descripcion: "Salsa de tomate artesanal, queso mozzarella y pepperoni.",
    precio: 180.00,
    categoria_id: 1,
    imagen_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
    activo: true,
  },
  {
    id: 3,
    nombre: "Tacos al Pastor (Orden de 4)",
    descripcion: "Tradicionales taquitos con piña, cilantro y cebolla.",
    precio: 85.00,
    categoria_id: 1,
    imagen_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800",
    activo: true,
  },
  {
    id: 4,
    nombre: "Refresco de Cola",
    descripcion: "Lata 355ml bien fría.",
    precio: 35.00,
    categoria_id: 2,
    imagen_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800",
    activo: true,
  },
  {
    id: 5,
    nombre: "Limonada mineral",
    descripcion: "Con chía y un toque de menta.",
    precio: 45.00,
    categoria_id: 2,
    imagen_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800",
    activo: true,
  }
];

// ============================================================================
// STORE ZUSTAND MOCK
// ============================================================================
export const useAppStore = create(
  persist(
    (set, get) => ({
      numeroMesa: null,
      carrito: [],
      products: [],
      loadingProducts: true,
      ordenActual: null,
      pollingInterval: null, // Guardará la referencia del timeout de simulación
      categorias: [
        { id: 1, nombre: 'PLATILLOS' },
        { id: 2, nombre: 'BEBIDAS' },
        { id: 3, nombre: 'POSTRES' }
      ],

      setNumeroMesa: (numero) => set({ numeroMesa: numero }),

      // Simula que la mesa siempre existe y está libre
      validarMesa: async (numero) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ id: numero, numero: numero, estado: 'libre' });
          }, 300);
        });
      },

      fetchProducts: async () => {
        set({ loadingProducts: true });
        // Simular retraso de red
        return new Promise((resolve) => {
          setTimeout(() => {
            set({ products: MOCK_PRODUCTS, loadingProducts: false });
            resolve(MOCK_PRODUCTS);
          }, 800);
        });
      },

      // --- CARRITO ---
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
            item.id === productoId ? { ...item, cantidad: item.cantidad - 1 } : item
          )
        };
      }),

      limpiarCarrito: () => set({ carrito: [] }),

      // --- ORDEN (MOCK) ---
      addOrder: async () => {
        const { carrito, numeroMesa } = get();
        if (carrito.length === 0 || !numeroMesa) return;

        // Simulamos respuesta del servidor
        const mockOrderResponse = {
          orden_id: Math.floor(Math.random() * 1000) + 1,
          estado: 'pendiente_confirmacion',
          subtotal: carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0),
          iva: carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0) * 0.16,
          total: carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0) * 1.16,
          mesa_numero: numeroMesa,
          detalles: carrito.map(i => ({
            id: Math.floor(Math.random() * 10000),
            producto: i.nombre,
            cantidad: i.cantidad,
            estado_preparacion: 'pendiente'
          }))
        };

        return new Promise((resolve) => {
          setTimeout(() => {
            set({ ordenActual: mockOrderResponse });
            get().limpiarCarrito();
            resolve(mockOrderResponse);
          }, 1000);
        });
      },

      // Simular progresión de tiempo real (Polling Fantasma)
      startOrderPolling: (ordenId) => {
        // En lugar de llamar al backend, avanzamos de estado automáticamente con Timeouts
        const { pollingInterval, ordenActual } = get();
        if (pollingInterval) clearTimeout(pollingInterval);
        
        if (!ordenActual) return;

        let currentState = ordenActual.estado;

        const loop = () => {
          const timer = setTimeout(() => {
            const { ordenActual: updatedOrder } = get();
            if(!updatedOrder) return;

            // Lógica de progresión:
            // pendiente_confirmacion => en_preparacion => lista => entregada
            let nextState = currentState;
            if (currentState === 'pendiente_confirmacion') {
              nextState = 'en_preparacion';
            } else if (currentState === 'en_preparacion') {
              nextState = 'lista';
            } else if (currentState === 'lista') {
              nextState = 'entregada';
            }

            if (nextState !== currentState) {
              currentState = nextState;
              set({ ordenActual: { ...updatedOrder, estado: nextState } });
            }

            // Si no está entregada, continuar simulando progreso cada 7 segundos para exposición
            if (currentState !== 'entregada' && currentState !== 'cerrada') {
              loop();
            } else if (currentState === 'entregada' || currentState === 'cerrada') {
              set({ pollingInterval: null });
            }
          }, 7000); // Avanza un estado cada 7 segundos

          set({ pollingInterval: timer });
        };

        loop();
      },

      stopOrderPolling: () => {
        const { pollingInterval } = get();
        if (pollingInterval) {
          clearTimeout(pollingInterval);
          set({ pollingInterval: null });
        }
      },

      // --- ADMIN / AUTH (Mocks inútiles para que los componentes cliente esten satisfechos) ---
      usuario: null,
      fetchCurrentUser: async () => null,
      fetchMesasLibres: async () => [],
      crearOrdenMesero: async () => null,

    }),
    {
      name: 'app-storage-demo',
      // No guardar el estado activo de la orden simulada para evitar bugs al refrescar en la demo
      partialize: (state) => ({ carrito: state.carrito, numeroMesa: state.numeroMesa }), 
    }
  )
);
