import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { products as mockProducts } from '../data/mockData';
import { Save, RefreshCw, Upload, Plus, X } from 'lucide-react';

const MenuAdmin = () => {
    const { products, updateProduct, seedDatabase, createProduct } = useAppStore();
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    // State for Add Product Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: 'platos fuertes', // default
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' // default placeholder
    });

    // Agrupar productos por categoría
    const productsByCategory = products.reduce((acc, product) => {
        const cat = product.categoryId || 'otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setFormData(product);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async () => {
        await updateProduct(editingId, {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description
        });
        setEditingId(null);
    };

    const handleSeed = () => {
        if (window.confirm("¿Seguro que quieres subir los datos de prueba a la base de datos? Esto creará duplicados si ya existen.")) {
            seedDatabase(mockProducts);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return alert("Nombre y precio requeridos");

        await createProduct({
            ...newProduct,
            price: parseFloat(newProduct.price),
            categoryId: newProduct.category // Mapping form field 'category' to 'categoryId'
        });

        setIsAddModalOpen(false);
        setNewProduct({
            name: '',
            price: '',
            description: '',
            category: 'platos fuertes',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Menú</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold"
                    >
                        <Plus size={20} /> Nuevo Platillo
                    </button>

                    {products.length === 0 && (
                        <button
                            onClick={handleSeed}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 font-bold"
                        >
                            <Upload size={18} /> Cargar Datos Iniciales
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {Object.entries(productsByCategory).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="bg-gray-100 px-6 py-3 font-bold text-gray-700 uppercase tracking-wide">
                            {category}
                        </div>
                        <div className="divide-y divide-gray-100">
                            {items.map(product => (
                                <div key={product.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                                    />

                                    {editingId === product.id ? (
                                        <div className="flex-1 w-full grid gap-2">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="font-bold border rounded px-2 py-1 w-full"
                                                placeholder="Nombre del producto"
                                            />
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="text-sm border rounded px-2 py-1 w-full resize-none"
                                                rows="2"
                                                placeholder="Descripción"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    className="font-bold text-green-600 border rounded px-2 py-1 w-24"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={handleCancel} className="text-gray-500 px-3 py-1 text-sm font-semibold hover:bg-gray-100 rounded">Cancelar</button>
                                                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1 text-sm font-bold rounded flex items-center gap-1 hover:bg-green-700">
                                                    <Save size={14} /> Guardar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900">{product.name}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                                <span className="font-bold text-lg text-gray-900">${product.price}</span>
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="text-blue-600 font-semibold text-sm hover:underline"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-400 italic">
                        No hay productos. Usa el botón de arriba para cargar los iniciales.
                    </div>
                )}
            </div>

            {/* Modal Agregar Producto */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Nuevo Producto</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Ej. Hamburguesa Doble"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                                        <input
                                            required
                                            type="number"
                                            className="w-full border rounded-lg p-2 pl-7 focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="0.00"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select
                                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="platos fuertes">Platos Fuertes</option>
                                        <option value="bebidas">Bebidas</option>
                                        <option value="postres">Postres</option>
                                        <option value="entradas">Entradas</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                    rows="3"
                                    placeholder="Ingredientes y detalles..."
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    placeholder="https://..."
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                            >
                                Crear Producto
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuAdmin;
