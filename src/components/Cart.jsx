import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import CartItem from './CartItem';

const Cart = ({ onBack }) => {
    const { carrito, numeroMesa, addOrder, limpiarCarrito } = useAppStore();

    const total = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);

    const handleConfirmOrder = () => {
        if (carrito.length === 0) return;

        const orderData = {
            mesa_id: numeroMesa,
            items: carrito,
            total: total,
            timestamp: new Date().toISOString()
        };

        addOrder(orderData); // Guardar en "backend" simulado
        limpiarCarrito();
        alert('¡Pedido enviado a cocina!');
        onBack(); // Volver al menú
    };

    if (carrito.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <header className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-lg">Tu Carrito</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
                    <p className="mb-4">Tu carrito está vacío.</p>
                    <button onClick={onBack} className="text-orange-600 font-bold underline">
                        Volver al menú
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
            <header className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-lg">Tu Carrito ({carrito.length})</h1>
            </header>

            <div className="flex-1 p-4 flex flex-col gap-4">
                {carrito.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total a pagar</span>
                    <span className="text-2xl font-bold text-gray-900">${total}</span>
                </div>

                <button
                    onClick={handleConfirmOrder}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                    <CheckCircle />
                    Confirmar Pedido
                </button>
            </div>
        </div>
    );
};

export default Cart;
