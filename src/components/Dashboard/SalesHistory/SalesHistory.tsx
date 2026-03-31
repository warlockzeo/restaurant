import React from 'react';
import { Order } from '../../../utils/types';

interface SalesHistoryProps {
  completedOrders: Order[];
  onOrderClick: (order: Order) => void;
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({
  completedOrders,
  onOrderClick,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (order: Order) => {
    return order.items.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center'>
          📊 Histórico de Vendas
        </h2>
      </div>

      {completedOrders.length > 0 ? (
        <div className='space-y-3'>
          {completedOrders.map((order, index) => {
            const total = calculateTotal(order);

            return (
              <div
                key={index}
                className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                onClick={() => onOrderClick(order)}
              >
                <div className='flex items-start'>
                  <div className='flex-1'>
                    <div className='flex justify-between items-center gap-2'>
                      <div className='flex justify-between items-center gap-2'>
                        <span className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                          {formatDate(order.createdAt)}
                        </span>
                        <span className='text-sm text-gray-500 dark:text-gray-500'>
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                      <span className='text-lg font-bold text-green-600 dark:text-green-400'>
                        €{total.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {order.items.length} itens
                      </span>
                      <button className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium'>
                        Ver detalhes →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
