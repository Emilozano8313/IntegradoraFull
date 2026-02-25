import React, { useState } from 'react';
import { ChefHat, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const KitchenOrderCard = ({ order }) => {
    const { updateOrderStatus, cancelOrder } = useAppStore();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const handleStatusChange = (status) => {
        updateOrderStatus(order.id, status);
    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        if (cancelReason.trim()) {
            cancelOrder(order.id, cancelReason);
            setShowCancelModal(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendiente': return 'bg-yellow-100 border-yellow-300';
            case 'en_preparacion': return 'bg-blue-100 border-blue-300';
            case 'lista': return 'bg-green-100 border-green-300';
            case 'cancelada': return 'bg-red-100 border-red-300 opacity-75';
            default: return 'bg-white';
        }
    };

    return (
        <div className={`p-4 rounded-xl shadow-sm border-2 ${getStatusColor(order.estado)} flex flex-col gap-3 relative`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Mesa {order.mesa_id}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                    ${order.estado === 'pendiente' ? 'bg-yellow-200 text-yellow-800' : ''}
                    ${order.estado === 'en_preparacion' ? 'bg-blue-200 text-blue-800' : ''}
                    ${order.estado === 'lista' ? 'bg-green-200 text-green-800' : ''}
                    ${order.estado === 'cancelada' ? 'bg-red-200 text-red-800' : ''}
                `}>
                    {order.estado.replace('_', ' ')}
                </span>
            </div>

            {/* Items */}
            <ul className="divide-y divide-gray-200/50 bg-white/50 rounded-lg p-2 text-sm">
                {order.items.map((item, idx) => (
                    <li key={idx} className="py-2">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-800">{item.cantidad}x {item.name || item.nombre}</span>
                        </div>
                        {item.notas && (
                            <p className="text-orange-700 italic text-xs mt-1 bg-orange-50 p-1 rounded">
                                Nota: {item.notas}
                            </p>
                        )}
                    </li>
                ))}
            </ul>

            {/* Actions */}
            {order.estado !== 'lista' && order.estado !== 'cancelada' && (
                <div className="flex gap-2 mt-auto pt-2">
                    {order.estado === 'pendiente' && (
                        <button
                            onClick={() => handleStatusChange('en_preparacion')}
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 text-sm flex items-center justify-center gap-1"
                        >
                            <ChefHat size={16} /> Cocinar
                        </button>
                    )}
                    {order.estado === 'en_preparacion' && (
                        <button
                            onClick={() => handleStatusChange('lista')}
                            className="flex-1 bg-green-600 text-white rounded-lg py-2 font-bold hover:bg-green-700 text-sm flex items-center justify-center gap-1"
                        >
                            <CheckCircle size={16} /> Terminar
                        </button>
                    )}

                    <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-3 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200"
                        title="Cancelar Orden"
                    >
                        <XCircle size={20} />
                    </button>
                </div>
            )}

            {order.estado === 'cancelada' && (
                <p className="text-red-700 text-xs font-bold text-center border-t border-red-200 pt-2">
                    Motivo: {order.motivo_cancelacion}
                </p>
            )}

            {/* Cancel Modal Overlay */}
            {showCancelModal && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 rounded-xl">
                    <h4 className="font-bold text-red-600 mb-2">Cancelar Orden</h4>
                    <form onSubmit={handleCancelSubmit} className="w-full">
                        <textarea
                            autoFocus
                            placeholder="Motivo (ej: falta ingrediente)"
                            className="w-full text-sm border border-gray-300 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-red-500 outline-none"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 text-gray-500 text-sm py-1 font-semibold"
                            >
                                Atrás
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-red-600 text-white rounded-md py-1 text-sm font-bold shadow-md hover:bg-red-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default KitchenOrderCard;
