import React, { useState, useMemo } from 'react';
import Header from './Header';
import CategoryTabs from './CategoryTabs';
import ProductCard from './ProductCard';
import { useAppStore } from '../store/useAppStore';

const Menu = ({ onViewCart }) => {
    const { products, loadingProducts } = useAppStore();
    const [activeCategory, setActiveCategory] = useState('todos');

    // Derivar categorías únicas de los productos
    const categories = useMemo(() => {
        const uniqueCats = new Set(products.map(p => p.categoryId));
        const cats = [
            { id: 'todos', name: 'Todo' },
            ...Array.from(uniqueCats).map(catId => ({
                id: catId,
                name: catId.charAt(0).toUpperCase() + catId.slice(1)
            }))
        ];
        return cats;
    }, [products]);

    const filteredProducts = activeCategory === 'todos'
        ? products
        : products.filter(p => p.categoryId === activeCategory);

    if (loadingProducts) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando menú...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header onViewCart={onViewCart} />

            <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            <main className="flex-1 p-4 pb-24">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No hay productos disponibles en el menú.
                    </div>
                ) : (
                    filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No hay productos en esta categoría.
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default Menu;
