import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const CartItem = ({ item }) => {
    const {
        incrementarCantidad,
        decrementarCantidad,
        eliminarDelCarrito,
        actualizarNotaItem
    } = useAppStore();

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-orange-600 font-bold">${item.price * item.cantidad}</p>
                </div>

                <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button
                        onClick={() => decrementarCantidad(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 active:scale-95 transition-transform"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-bold w-6 text-center">{item.cantidad}</span>
                    <button
                        onClick={() => incrementarCantidad(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 active:scale-95 transition-transform"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="mt-2">
                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">
                    Notas / Instrucciones
                </label>
                <textarea
                    value={item.notas || ''}
                    onChange={(e) => actualizarNotaItem(item.id, e.target.value)}
                    placeholder="Ej: Sin cebolla, Salsa aparte..."
                    className="w-full text-sm bg-gray-50 border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none"
                    rows="2"
                />
            </div>
        </div>
    );
};

export default CartItem;
