import React, { useState } from 'react';
import { Order, OrderItem } from '../../utils/types';
import { SalesHistory } from './index';
import {
  SAMPLE_ORDER_ITEMS,
  SAMPLE_ORDERS_DB,
  transformOrderData,
} from '../../utils/mockData';

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Carregar ordens completadas do localStorage e dados mock
  const completedOrders: Order[] = React.useMemo(() => {
    // Carregar ordens completadas do localStorage
    const localStorageOrders = JSON.parse(
      localStorage.getItem('completed_orders') || '[]',
    );

    // Carregar ordens mock com status 'completed'
    const mockCompletedOrders = SAMPLE_ORDERS_DB.filter(
      (order) => order.status === 'completed',
    ).map((orderRecord) => {
      const orderItems = SAMPLE_ORDER_ITEMS.filter(
        (item) => item.order_id === orderRecord.id,
      );
      const transformedItems = transformOrderData(orderItems);

      return {
        items: transformedItems,
        createdAt: new Date(orderRecord.created_at).getTime(),
      };
    });

    // Combinar ordens do localStorage com mock (evitando duplicatas)
    const allOrders = [...localStorageOrders, ...mockCompletedOrders];

    // Ordenar por data (mais recentes primeiro)
    return allOrders.sort((a, b) => b.createdAt - a.createdAt);
  }, []);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Renderizar detalhes de ordem (mesa ativa ou completada)
  const renderOrderDetails = (
    order: Order,
    title: string,
    showDate: boolean = false,
    showBackButton: boolean = true,
  ) => {
    const categoryIcons = {
      Comida: '🍽️',
      Bebida: '🥤',
      Sobremesa: '🍰',
      Café: '☕',
    };

    return (
      <div
        className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6`}
      >
        <div className='flex justify-between items-center mb-4'>
          <h3 className={`text-xl font-bold flex items-center gap-2`}>
            <span>📋</span>
            {title}
            {showDate ? (
              <span className='flex items-center gap-2'>
                <span>📅</span>
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            ) : null}
          </h3>
          {showBackButton && (
            <button
              className='btn-gradient px-4 py-2 text-white rounded-lg hover:scale-105 transition-all'
              onClick={() => {
                if (selectedOrder) {
                  handleCloseDetails();
                } else {
                  onTableSelect('');
                }
              }}
            >
              ← Voltar
            </button>
          )}
        </div>

        <div className='space-y-3 mb-4'>
          {(() => {
            // Agrupar por categoria primeiro, depois por produto
            const groupedByCategory = order.items.reduce(
              (acc, item) => {
                const category = item.type || 'Comida';
                if (!acc[category]) {
                  acc[category] = {};
                }
                if (!acc[category][item.name]) {
                  acc[category][item.name] = {
                    items: [],
                    totalQty: 0,
                    totalPrice: 0,
                    staff: item.staff || 'N/A',
                  };
                }
                acc[category][item.name].items.push(item);
                acc[category][item.name].totalQty += item.qty;
                acc[category][item.name].totalPrice += item.qty * item.price;
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
                    staff: string;
                  }
                >
              >,
            );

            return Object.entries(groupedByCategory).map(
              ([category, products]) => (
                <div
                  key={category}
                  className={`${dark ? 'dark:bg-gray-700 dark:text-white' : 'card-gradient text-gray-900'} rounded-lg p-4 shadow-md`}
                >
                  <h4 className='font-bold text-lg mb-3 flex items-center gap-2'>
                    <span>
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </span>
                    {category}
                  </h4>
                  {Object.entries(products).map(([productName, data]) => (
                    <div
                      key={productName}
                      className={`${dark ? 'dark:bg-gray-600 dark:text-white' : 'card-gradient text-gray-900'} ml-4 mb-3 p-3 rounded-lg border-l-4 border-blue-500 shadow-sm`}
                    >
                      <div className='flex justify-between items-center'>
                        <div>
                          <div className='font-bold text-lg'>
                            {data.totalQty}× {productName}
                          </div>
                          <div className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
                            👤 Vendido por: {data.staff}
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
                  ))}
                </div>
              ),
            );
          })()}
        </div>

        <div className='border-t border-gray-200 dark:border-gray-600 pt-4 mt-4'>
          <div className='flex justify-end items-center text-xl font-bold '>
            <span className='flex items-center gap-2'>
              <span>💰</span>
              Total:
              <span className='text-2xl'>€ {total(order).toFixed(2)}</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar detalhes da ordem selecionada (mesa ativa ou completada)
  if (selectedOrder) {
    return renderOrderDetails(
      selectedOrder,
      `Venda Finalizada - ${(selectedOrder as any).tableId || 'Histórico'}`,
      true,
    );
  }

  if (selectedTable && orders[selectedTable]) {
    // DETALHES DO PEDIDO DA MESA SELECIONADA
    return renderOrderDetails(
      orders[selectedTable],
      `Pedido - Mesa ${selectedTable}`,
      false,
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
          const totalItems = hasItems
            ? order.items.reduce((sum, item) => sum + item.qty, 0)
            : 0;
          return (
            <div
              key={t.id}
              className={`table-card p-4 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 ${
                hasItems ? 'occupied' : ''
              }`}
              onClick={() => hasItems && onTableSelect(t.id)}
            >
              <div className='font-bold text-lg text-white'>{t.name}</div>
              <div className='text-sm mt-2 text-white'>
                {hasItems ? (
                  <>
                    <div className='flex'>
                      <div className='flex items-center gap-1 opacity-95'>
                        <span>📋</span>
                        <span>Itens: {totalItems}</span>
                      </div>
                      <div className='flex items-center gap-1 opacity-95'>
                        <span>💰</span>
                        <span>Total: € {total(order).toFixed(2)}</span>
                      </div>
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

      {/* Histórico de Vendas */}
      <SalesHistory
        completedOrders={completedOrders}
        onOrderClick={handleOrderClick}
      />
    </>
  );
};
