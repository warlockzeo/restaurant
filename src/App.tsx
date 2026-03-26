import React, { useState, useEffect } from 'react';
import { SAMPLE_MENU, SAMPLE_TABLES, SAMPLE_WAITERS } from './utils/mockData';
import {
  categs,
  Waiter,
  Table,
  MenuItem,
  Order,
  OrderItem,
} from './utils/types';
import { MenuCategory } from './components/MenuCategory/MenuCategory';
import { TableButton } from './components/TableButton/TableButton';
import { OrderItemRow } from './components/OrderItemRow/OrderItemRow';

const STORAGE_KEY = 'restaurante_layout_v4_ts';

type OrdersMap = Record<string, Order>;

const loadState = (): { orders?: OrdersMap } => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const saveState = (state: { orders: OrdersMap }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const App: React.FC = () => {
  const [dark] = useState(false);
  const [tables] = useState<Table[]>(SAMPLE_TABLES);
  const [waiters] = useState<Waiter[]>(SAMPLE_WAITERS);
  const [menu] = useState<MenuItem[]>(SAMPLE_MENU);
  const [orders, setOrders] = useState<OrdersMap>(
    () => loadState().orders || {},
  );
  const [activeTable, setActiveTable] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const [activeWaiter, setActiveWaiter] = useState<string>('');
  const [selectedDashboardTable, setSelectedDashboardTable] =
    useState<string>('');

  console.log(waiters);
  useEffect(() => saveState({ orders }), [orders]);
  useEffect(() => {
    if (dashboard) {
      setActiveTable('');
      setActiveWaiter(''); // Resetar funcionário ao entrar no dashboard
    }
  }, [dashboard]);

  useEffect(() => {
    if (selectedDashboardTable && orders[selectedDashboardTable]) {
      console.log(
        '📋 Pedido da Mesa',
        selectedDashboardTable,
        ':',
        orders[selectedDashboardTable],
      );
    }
  }, [selectedDashboardTable, orders]);
  const createOrder = (tableId: string) => {
    if (!orders[tableId]) {
      setOrders((prev) => ({
        ...prev,
        [tableId]: {
          waiterId: null,
          items: [],
          createdAt: Date.now(),
        },
      }));
    }
  };

  const addItem = (tableId: string, product: MenuItem) => {
    const prev = orders;

    const order = prev[tableId] || {
      items: [] as OrderItem[],
      waiterId: null,
      createdAt: Date.now(),
    };

    // Sempre adiciona um novo item individual para cada venda
    order.items.push({
      ...product,
      qty: 1,
      staff: activeWaiter,
      id: `${product.id}_${Date.now()}_${Math.random()}`, // ID único para cada venda
    });

    setOrders((prev) => {
      return { ...prev, [tableId]: { ...order } };
    });
  };

  const deleteItem = (tableId: string, itemId: string) => {
    setOrders((prev) => {
      const order = prev[tableId];
      if (!order) return prev;
      const updated = order.items.filter((i) => i.id !== itemId);
      return { ...prev, [tableId]: { ...order, items: updated } };
    });
  };

  const changeQty = (tableId: string, itemId: string, delta: number) => {
    setOrders((prev) => {
      const order = prev[tableId];
      if (!order) return prev;
      const updated = order.items.map((i) =>
        i.id === itemId ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      );
      return { ...prev, [tableId]: { ...order, items: updated } };
    });
  };

  const total = (order: Order): number =>
    order.items.reduce((s, i) => s + i.price * i.qty, 0);

  const printBill = (order: Order, tableId: string) => {
    const win = window.open('', '_blank');
    if (!win) return;

    win.document.write(`
      <h1>Conta - ${tableId}</h1>
      <ul>
        ${order.items
          .map(
            (i) =>
              `<li>${i.qty}× ${i.name} — € ${(i.qty * i.price).toFixed(2)} ${
                i.staff ? `(por: ${i.staff})` : ''
              }</li>`,
          )
          .join('')}
      </ul>
      <h2>Total: € ${total(order).toFixed(2)}</h2>
    `);
    win.print();
  };

  const freeTable = () => {
    const updated = { ...orders };
    delete updated[activeTable];
    setOrders(updated);
    setActiveTable('');
    setShowCheckout(false);
  };

  const leaveTable = () => {
    if (orders[activeTable].items.length === 0) {
      freeTable();
    } else setActiveTable('');
  };

  const categories = categs;

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4 pb-20'>
        {/* TABS DE NAVEGAÇÃO */}
        <div className='mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>🍽️ Sistema de Pedidos</h1>
            {activeWaiter && (
              <div className='text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full'>
                👤 {activeWaiter}
              </div>
            )}
          </div>
          <div className='flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1'>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                !dashboard
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setDashboard(false)}
            >
              Sistema
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                dashboard
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setDashboard(true)}
            >
              Dashboard
            </button>
          </div>
        </div>

        {dashboard ? (
          // DASHBOARD - sem seleção de funcionário
          <div className='animate-fadeIn space-y-4'>
            <h2 className='text-xl font-semibold'>📊 Status das Mesas</h2>

            {selectedDashboardTable && orders[selectedDashboardTable] ? (
              // DETALHES DO PEDIDO DA MESA SELECIONADA
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-bold'>
                    Pedido - Mesa {selectedDashboardTable}
                  </h3>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                    onClick={() => setSelectedDashboardTable('')}
                  >
                    ← Voltar
                  </button>
                </div>

                <div className='space-y-3 mb-4'>
                  {(() => {
                    // Agrupar itens por produto e depois por funcionário
                    const groupedByProduct = orders[
                      selectedDashboardTable
                    ].items.reduce(
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
                        acc[item.name][item.staff || 'N/A'].totalQty +=
                          item.qty;
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
                          className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3'
                        >
                          <h4 className='font-bold text-gray-900 dark:text-white mb-2'>
                            {productName}
                          </h4>
                          {Object.entries(staffGroups).map(
                            ([staffName, data]) => (
                              <div
                                key={staffName}
                                className='ml-4 mb-2 p-2 bg-white dark:bg-gray-600 rounded border-l-3 border-blue-500'
                              >
                                <div className='flex justify-between items-center'>
                                  <div>
                                    <div className='font-medium text-gray-900 dark:text-white'>
                                      {data.totalQty}× vendidos
                                    </div>
                                    <div className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                                      👤 Vendido por: {staffName}
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <div className='font-bold text-gray-900 dark:text-white'>
                                      € {data.totalPrice.toFixed(2)}
                                    </div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>
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

                <div className='border-t pt-3'>
                  <div className='flex justify-between items-center text-lg font-bold'>
                    <span>Total:</span>
                    <span>
                      € {total(orders[selectedDashboardTable]).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // GRID DE MESAS
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {tables.map((t) => {
                  const order = orders[t.id];
                  const hasItems = order && order.items.length > 0;
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl shadow cursor-pointer transition-transform hover:scale-105 ${
                        hasItems
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white'
                      }`}
                      onClick={() =>
                        hasItems && setSelectedDashboardTable(t.id)
                      }
                    >
                      <div className='font-bold'>{t.name}</div>
                      <div className='text-sm mt-1'>
                        {hasItems ? (
                          <>
                            <div>Itens: {order.items.length}</div>
                            <div>Total: € {total(order).toFixed(2)}</div>
                            <div className='text-xs mt-1 opacity-75'>
                              Clique para ver detalhes
                            </div>
                          </>
                        ) : (
                          <span className='text-white-500'>Livre</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // SISTEMA DE PEDIDOS - com seleção de funcionário
          <>
            {!activeWaiter ? (
              <div className='space-y-3 animate-fadeIn'>
                <h2 className='text-lg font-semibold'>Selecione o atendente</h2>
                {waiters.map((w) => (
                  <button
                    key={w.id}
                    className='w-full p-4 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700'
                    onClick={() => setActiveWaiter(w.name)}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {/* STEP 1 - SELECT TABLE */}
                {!activeTable && !showCheckout && (
                  <div className='space-y-3 animate-fadeIn'>
                    <h2 className='text-lg font-semibold'>Selecione a mesa</h2>
                    {tables.map((t) => (
                      <TableButton
                        table={t}
                        occupied={!!orders[t.id]}
                        onClick={() => {
                          createOrder(t.id);
                          setActiveTable(t.id);
                        }}
                        isActive={false} //não está fazendo nada
                      />
                    ))}
                  </div>
                )}
                {/* STEP 2 - ORDER SCREEN */}
                {activeTable && !showCheckout && (
                  <div className='space-y-4 animate-fadeIn'>
                    <button
                      className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
                      onClick={() => leaveTable()}
                    >
                      ← Trocar Mesa
                    </button>

                    <h2 className='text-xl font-semibold'>
                      Mesa {activeTable}
                    </h2>

                    {/* ORDER ITEMS */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'>
                      <h3 className='font-semibold mb-2'>Itens do Pedido</h3>
                      {orders[activeTable].items.length === 0 && (
                        <p className='text-sm text-gray-500'>
                          Nenhum item ainda.
                        </p>
                      )}

                      {(() => {
                        // Agrupar itens por produto para visualização
                        const groupedItems = orders[activeTable].items.reduce(
                          (acc, item) => {
                            if (!acc[item.name]) {
                              acc[item.name] = {
                                ...item,
                                originalItems: [],
                                totalQty: 0,
                                staffs: new Set(),
                              };
                            }
                            acc[item.name].originalItems.push(item);
                            acc[item.name].totalQty += item.qty;
                            acc[item.name].staffs.add(item.staff);
                            return acc;
                          },
                          {} as Record<string, any>,
                        );

                        return Object.values(groupedItems).map(
                          (groupedItem: any) => (
                            <div
                              key={groupedItem.name}
                              className='mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                            >
                              <div className='flex justify-between items-center'>
                                <div className='font-medium text-gray-900 dark:text-white'>
                                  {groupedItem.totalQty}× {groupedItem.name}
                                </div>
                                <div className='flex gap-2'>
                                  <button
                                    className='w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center font-medium'
                                    onClick={() => {
                                      // Remove o último item adicionado deste produto
                                      const lastItem =
                                        groupedItem.originalItems[
                                          groupedItem.originalItems.length - 1
                                        ];
                                      deleteItem(activeTable, lastItem.id);
                                    }}
                                  >
                                    -
                                  </button>
                                  <button
                                    className='w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center font-medium'
                                    onClick={() => {
                                      // Adiciona novo item com o funcionário atual
                                      addItem(activeTable, {
                                        id: groupedItem.id,
                                        name: groupedItem.name,
                                        price: groupedItem.price,
                                        type: groupedItem.type,
                                      });
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ),
                        );
                      })()}
                    </div>

                    {/* MENU CATEGORIES */}
                    {categories.map((cat) => (
                      <MenuCategory
                        key={cat}
                        category={cat}
                        items={menu.filter((p) => p.type === cat)}
                        onAdd={(prod) => addItem(activeTable, prod)}
                      />
                    ))}

                    <button
                      className='w-full p-4 rounded-xl bg-green-600 text-white font-bold shadow'
                      onClick={() =>
                        orders[activeTable].items.length
                          ? setShowCheckout(true)
                          : freeTable()
                      }
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                )}

                {/* CHECKOUT */}
                {showCheckout && activeTable && (
                  <div className='animate-fadeIn'>
                    <button
                      className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
                      onClick={() => setShowCheckout(false)}
                    >
                      ← Voltar ao Pedido
                    </button>

                    <h2 className='text-xl font-bold mt-2'>
                      Conta da Mesa {activeTable}
                    </h2>

                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-3'>
                      {orders[activeTable].items.map((i) => (
                        <OrderItemRow
                          item={i}
                          onDecrease={() => changeQty(activeTable, i.id, -1)}
                          onDelete={() => deleteItem(activeTable, i.id)}
                          onIncrease={() => changeQty(activeTable, i.id, 1)}
                          showPrice
                        />
                      ))}

                      <div className='text-right font-bold text-lg pt-3'>
                        Total: € {total(orders[activeTable]).toFixed(2)}
                      </div>

                      <button
                        className='w-full mt-4 p-4 rounded-xl bg-blue-700 text-white font-bold shadow'
                        onClick={() =>
                          printBill(orders[activeTable], activeTable)
                        }
                      >
                        🖨️ Imprimir Conta
                      </button>

                      <button
                        className='w-full mt-2 p-4 rounded-xl bg-gray-500 text-white font-bold shadow'
                        onClick={freeTable}
                      >
                        ✔️ Fechar Mesa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
