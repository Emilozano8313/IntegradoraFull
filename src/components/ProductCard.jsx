import React from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const ProductCard = ({ product }) => {
    const { agregarAlCarrito } = useAppStore();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transform transition-all active:scale-[0.98]">
            <div className="relative h-40 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-xl text-gray-900">${product.price}</span>
                    <button
                        onClick={() => agregarAlCarrito(product)}
                        className="bg-orange-600 text-white p-2.5 rounded-full shadow-lg hover:bg-orange-700 active:bg-orange-800 transition-colors"
                        aria-label="Agregar al carrito"
                    >
                        <Plus size={24} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
