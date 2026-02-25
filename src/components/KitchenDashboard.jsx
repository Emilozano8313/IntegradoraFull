import React from 'react';
import { useAppStore } from '../store/useAppStore';
import KitchenOrderCard from './KitchenOrderCard';
import { ChefHat } from 'lucide-react';

const KitchenDashboard = () => {
    const { orders } = useAppStore();

    // Filtrar órdenes por estado
    const pendingOrders = orders
        .filter(o => o.estado === 'pendiente')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const preparingOrders = orders
        .filter(o => o.estado === 'en_preparacion')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const completedOrders = orders
        .filter(o => o.estado === 'lista' || o.estado === 'cancelada')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col p-4 overflow-hidden">
            <header className="mb-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg text-white">
                        <ChefHat size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Cocina en Vivo</h1>
                        <p className="text-gray-500 text-sm font-medium">Gestión de Órdenes</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
                {/* Columna: Pendientes */}
                <div className="bg-red-50/50 rounded-xl border border-red-100 flex flex-col h-full">
                    <div className="p-3 border-b border-red-100 bg-red-100/50 rounded-t-xl shrink-0">
                        <h2 className="font-bold text-red-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Pendientes ({pendingOrders.length})
                        </h2>
                    </div>
                    <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-3 scrollbar-thin">
                        {pendingOrders.map(order => (
                            <KitchenOrderCard key={order.id} order={order} />
                        ))}
                        {pendingOrders.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-10 italic">
                                No hay órdenes pendientes
                            </p>
                        )}
                    </div>
                </div>

                {/* Columna: En Preparación */}
                <div className="bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col h-full">
                    <div className="p-3 border-b border-blue-100 bg-blue-100/50 rounded-t-xl shrink-0">
                        <h2 className="font-bold text-blue-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            En Preparación ({preparingOrders.length})
                        </h2>
                    </div>
                    <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-3 scrollbar-thin">
                        {preparingOrders.map(order => (
                            <KitchenOrderCard key={order.id} order={order} />
                        ))}
                        {preparingOrders.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-10 italic">
                                Nada en preparación
                            </p>
                        )}
                    </div>
                </div>

                {/* Columna: Terminados */}
                <div className="bg-green-50/50 rounded-xl border border-green-100 flex flex-col h-full">
                    <div className="p-3 border-b border-green-100 bg-green-100/50 rounded-t-xl shrink-0">
                        <h2 className="font-bold text-green-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Terminados ({completedOrders.length})
                        </h2>
                    </div>
                    <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-3 scrollbar-thin">
                        {completedOrders.map(order => (
                            <KitchenOrderCard key={order.id} order={order} />
                        ))}
                        {completedOrders.length === 0 && (
                            <p className="text-center text-gray-400 text-sm py-10 italic">
                                Historial vacío
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
