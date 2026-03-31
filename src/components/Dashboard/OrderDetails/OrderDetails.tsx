import React from 'react';
import { Order, OrderItem } from '../../../utils/types';

interface OrderDetailsProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (order: Order): number => {
    return order.items.reduce(
      (total: number, item: OrderItem) => total + item.price * item.qty,
      0,
    );
  };

  const calculateSubtotal = (item: any): number => {
    return item.price * item.qty;
  };

  // Agrupar itens por nome para mostrar resumo
  const groupedItems = order.items.reduce(
    (acc: any, item: OrderItem) => {
      const key = `${item.name}_${item.price}`;
      if (!acc[key]) {
        acc[key] = {
          name: item.name,
          price: item.price,
          type: item.type,
          totalQty: 0,
          staff: [],
        };
      }
      acc[key].totalQty += item.qty;
      if (!acc[key].staff.includes(item.staff)) {
        acc[key].staff.push(item.staff);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const total = calculateTotal(order);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
              📋 Detalhes da Venda
            </h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl'
            >
              ×
            </button>
          </div>

          <div className='mb-6'>
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
              Data e Hora:
            </div>
            <div className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
              {formatDate(order.createdAt)}
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>
              🛒 Itens Vendidos
            </h3>

            <div className='space-y-3'>
              {Object.values(groupedItems).map((item: any, index: number) => (
                <div
                  key={index}
                  className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex-1'>
                      <div className='font-semibold text-gray-800 dark:text-gray-200'>
                        {item.name}
                      </div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        {item.type} • €{item.price.toFixed(2)} cada
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                        {item.totalQty}x
                      </div>
                      <div className='text-sm text-gray-600 dark:text-gray-400'>
                        €{calculateSubtotal(item).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-600'>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      Vendido por:
                    </div>
                    <div className='flex flex-wrap gap-1 mt-1'>
                      {item.staff.map(
                        (staffName: string, staffIndex: number) => (
                          <span
                            key={staffIndex}
                            className='inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded'
                          >
                            {staffName}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='border-t-2 border-gray-200 dark:border-gray-700 pt-4'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Total de Itens:
                </div>
                <div className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                  {order.items.length} itens
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  Valor Total:
                </div>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  €{total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            >
              Fechar
            </button>
            <button
              onClick={() => {
                const printContent = `
                  <h1>Detalhes da Venda</h1>
                  <p>Data: ${formatDate(order.createdAt)}</p>
                  <h2>Itens:</h2>
                  <ul>
                    ${Object.values(groupedItems)
                      .map(
                        (item: any) =>
                          `<li>${(item as any).totalQty}x ${(item as any).name} - €${calculateSubtotal(item).toFixed(2)}</li>`,
                      )
                      .join('')}
                  </ul>
                  <h2>Total: €${total.toFixed(2)}</h2>
                `;
                const win = window.open('', '_blank');
                if (win) {
                  win.document.write(printContent);
                  win.print();
                }
              }}
              className='flex-1 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors'
            >
              🖨️ Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
