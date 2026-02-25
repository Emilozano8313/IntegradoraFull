import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingBag } from 'lucide-react';

const Header = ({ onViewCart }) => {
    const { numeroMesa, carrito } = useAppStore();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="px-4 h-16 flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ordenando para</span>
                    <h2 className="text-xl font-bold text-gray-900 leading-none">Mesa {numeroMesa}</h2>
                </div>

                {/* Simple cart indicator for header, detailed one is floating */}
                <div className="relative p-2" onClick={onViewCart}>
                    <div className="bg-orange-100 p-2 rounded-full cursor-pointer hover:bg-orange-200 transition-colors">
                        <ShoppingBag size={24} className="text-orange-600" />
                    </div>
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {totalItems}
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
