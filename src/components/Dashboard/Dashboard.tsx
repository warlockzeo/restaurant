import React from 'react';
import { Order, OrderItem } from '../../utils/types';

interface DashboardProps {
  orders: Record<string, Order>;
  selectedTable: string;
  onTableSelect: (tableId: string) => void;
  tables: Array<{ id: string; name: string }>;
  dark?: boolean;
}

const total = (order: Order): number =>
  order.items.reduce((s, i) => s + i.price * i.qty, 0);

export const Dashboard: React.FC<DashboardProps> = ({
  orders,
  selectedTable,
  onTableSelect,
  tables,
  dark = false,
}) => {
  if (selectedTable && orders[selectedTable]) {
    // DETALHES DO PEDIDO DA MESA SELECIONADA
    return (
      <div
        className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6`}
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className={`text-xl font-bold flex items-center gap-2`}>
            <span>📋</span>
            Pedido - Mesa {selectedTable}
          </h3>
          <button
            className='btn-gradient px-4 py-2 text-white rounded-lg hover:scale-105 transition-all'
            onClick={() => onTableSelect('')}
          >
            ← Voltar
          </button>
        </div>

        <div className='space-y-3 mb-4'>
          {(() => {
            // Agrupar itens por produto e depois por funcionário
            const groupedByProduct = orders[selectedTable].items.reduce(
              (acc, item) => {
                if (!acc[item.name]) {
                  acc[item.name] = {};
                }
                if (!acc[item.name][item.staff || 'N/A']) {
                  acc[item.name][item.staff || 'N/A'] = {
                    items: [],
                    totalQty: 0,
                    totalPrice: 0,
                  };
                }
                acc[item.name][item.staff || 'N/A'].items.push(item);
                acc[item.name][item.staff || 'N/A'].totalQty += item.qty;
                acc[item.name][item.staff || 'N/A'].totalPrice +=
                  item.qty * item.price;
                return acc;
              },
              {} as Record<
                string,
                Record<
                  string,
                  {
                    items: OrderItem[];
                    totalQty: number;
                    totalPrice: number;
                  }
                >
              >,
            );

            return Object.entries(groupedByProduct).map(
              ([productName, staffGroups]) => (
                <div
                  key={productName}
                  className={`${dark ? 'dark:bg-gray-700 dark:text-white' : 'card-gradient text-gray-900'} rounded-lg p-4 shadow-md`}
                >
                  <h4 className='font-bold text-lg mb-3 flex items-center gap-2'>
                    <span>🍽️</span>
                    {productName}
                  </h4>
                  {Object.entries(staffGroups).map(
                    ([staffName, data]) => (
                      <div
                        key={staffName}
                        className={`${dark ? 'dark:bg-gray-700 dark:text-white' : 'card-gradient text-gray-900'} ml-4 mb-3 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm`}
                      >
                        <div className='flex justify-between items-center'>
                          <div>
                            <div className='font-bold text-lg'>
                              {data.totalQty}× vendidos
                            </div>
                            <div className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
                              👤 Vendido por: {staffName}
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='font-bold text-lg'>
                              € {data.totalPrice.toFixed(2)}
                            </div>
                            <div className='text-sm'>
                              € {data.items[0]?.price.toFixed(2)} cada
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ),
            );
          })()}
        </div>

        <div className='border-t border-gray-200 dark:border-gray-600 pt-4 mt-4'>
          <div className='flex justify-between items-center text-xl font-bold '>
            <span className='flex items-center gap-2'>
              <span>💰</span>
              Total:
            </span>
            <span className='text-2xl'>
              € {total(orders[selectedTable]).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // GRID DE MESAS
  return (
    <>
      <h2
        className={`text-2xl font-bold ${dark ? ' dark:text-gray-200' : 'text-gray-800'} flex items-center gap-2 mb-4`}
      >
        <span>📊</span>
        Status das Mesas
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {tables.map((t) => {
          const order = orders[t.id];
          const hasItems = order && order.items.length > 0;
          return (
            <div
              key={t.id}
              className={`table-card p-4 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 ${
                hasItems ? 'occupied' : ''
              }`}
              onClick={() => hasItems && onTableSelect(t.id)}
            >
              <div className='font-bold text-lg text-white'>
                {t.name}
              </div>
              <div className='text-sm mt-2 text-white'>
                {hasItems ? (
                  <>
                    <div className='flex items-center gap-1 opacity-95'>
                      <span>📋</span>
                      <span>Itens: {order.items.length}</span>
                    </div>
                    <div className='flex items-center gap-1 opacity-95'>
                      <span>💰</span>
                      <span>Total: € {total(order).toFixed(2)}</span>
                    </div>
                    <div className='text-xs mt-2 opacity-90 font-medium bg-white/20 px-2 py-1 rounded'>
                      👆 Clique para ver detalhes
                    </div>
                  </>
                ) : (
                  <div className='flex items-center gap-2 text-lg opacity-95'>
                    <span>✅</span>
                    <span>Livre</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
