import React, { useState, useEffect } from 'react';
import { SAMPLE_MENU, SAMPLE_TABLES } from './utils/mockData';
import { categs, Table, MenuItem, Order, OrderItem } from './utils/types';
import { MenuCategory } from './components/MenuCategory/MenuCategory';
import { TableButton } from './components/TableButton/TableButton';
import { OrderItemRow } from './components/OrderItemRow/OrderItemRow';
import { useAuth } from './contexts/AuthContext';

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

const App = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => {
    // Verificar preferência salva ou preferência do sistema
    const saved = sessionStorage.getItem('restaurante_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [tables] = useState<Table[]>(SAMPLE_TABLES);
  const [menu] = useState<MenuItem[]>(SAMPLE_MENU);
  const [orders, setOrders] = useState<OrdersMap>(
    () => loadState().orders || {},
  );
  const [activeTable, setActiveTable] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedDashboardTable, setSelectedDashboardTable] =
    useState<string>('');

  // Usuário logado como atendente
  const activeWaiter = user?.name || '';

  // Determinar se deve mostrar dashboard ou sistema baseado no role
  const shouldShowDashboard = user?.role === 'admin';

  // Salvar preferência do modo dark
  useEffect(() => {
    sessionStorage.setItem('restaurante_dark_mode', dark.toString());
  }, [dark]);

  useEffect(() => saveState({ orders }), [orders]);
  useEffect(() => {
    if (shouldShowDashboard) {
      setActiveTable('');
      // Resetar funcionário ao entrar no dashboard (não necessário mais pois usa user logado)
    }
  }, [shouldShowDashboard]);

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
      <div
        className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${dark ? 'dark:from-gray-900 dark:to-gray-800 text-gray-200' : 'text-gray-900'}   p-4 pb-20`}
      >
        {/* HEADER */}
        <div className='mb-6'>
          <div className='header-gradient flex justify-between items-center mb-4'>
            <div className='flex items-center gap-4'>
              <h1 className='text-2xl font-bold text-white'>
                🍽️ {shouldShowDashboard ? 'Dashboard' : 'Sistema'} de Pedidos
              </h1>
            </div>
            <div className='flex flex-col items-center gap-2'>
              {user && (
                <div className='badge-gradient'>
                  {user.role === 'admin' ? '👤' : '🍽️'} {user.name}
                </div>
              )}
              <div className='flex items-center gap-2'>
                {' '}
                <button
                  onClick={() => setDark(!dark)}
                  className='px-3 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all font-medium border border-white/30'
                  title={
                    dark
                      ? 'Alternar para modo claro'
                      : 'Alternar para modo escuro'
                  }
                >
                  {dark ? '☀️' : '🌙'}
                </button>
                <button onClick={logout} className='btn-gradient'>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {shouldShowDashboard ? (
          // DASHBOARD - sem seleção de funcionário
          <div className='animate-fadeIn space-y-4'>
            <h2
              className={`text-2xl font-bold ${dark ? ' dark:text-gray-200' : 'text-gray-800'} flex items-center gap-2`}
            >
              <span>📊</span>
              Status das Mesas
            </h2>

            {selectedDashboardTable && orders[selectedDashboardTable] ? (
              // DETALHES DO PEDIDO DA MESA SELECIONADA
              <div
                className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6`}
              >
                <div className='flex justify-between items-center mb-4'>
                  <h3 className={`text-xl font-bold flex items-center gap-2`}>
                    <span>📋</span>
                    Pedido - Mesa {selectedDashboardTable}
                  </h3>
                  <button
                    className='btn-gradient px-4 py-2 text-white rounded-lg hover:scale-105 transition-all'
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
                                className='ml-4 mb-3 p-3 bg-white dark:bg-gray-600 rounded-lg border-l-4 border-blue-500 shadow-sm'
                              >
                                <div className='flex justify-between items-center'>
                                  <div>
                                    <div className='font-bold text-gray-900 dark:text-white text-lg'>
                                      {data.totalQty}× vendidos
                                    </div>
                                    <div className='text-sm font-medium text-blue-600 dark:text-blue-400 mt-1'>
                                      👤 Vendido por: {staffName}
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <div className='font-bold text-gray-900 dark:text-white text-lg'>
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

                <div className='border-t border-gray-200 dark:border-gray-600 pt-4 mt-4'>
                  <div className='flex justify-between items-center text-xl font-bold '>
                    <span className='flex items-center gap-2'>
                      <span>💰</span>
                      Total:
                    </span>
                    <span className='text-2xl'>
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
                      className={`table-card p-4 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105 ${
                        hasItems ? 'occupied' : ''
                      }`}
                      onClick={() =>
                        hasItems && setSelectedDashboardTable(t.id)
                      }
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
            )}
          </div>
        ) : (
          // SISTEMA DE PEDIDOS - usuário logado como atendente
          <>
            <div className='space-y-4'>
              {/* STEP 1 - SELECT TABLE */}
              {!activeTable && !showCheckout && (
                <div className='space-y-3 animate-fadeIn'>
                  <h2 className='text-lg font-semibold '>Selecione a mesa</h2>
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
                  {/* ORDER ITEMS */}
                  <div
                    className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6`}
                  >
                    <div className='flex justify-between items-center mb-4'>
                      <h2 className='text-xl font-semibold'>
                        Itens da Mesa {activeTable}
                      </h2>

                      <button
                        className='px-3 py-2 btn-gradient text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
                        onClick={() => leaveTable()}
                      >
                        ← Trocar Mesa
                      </button>
                    </div>
                    {orders[activeTable].items.length === 0 && (
                      <p className='text-sm  text-center py-4'>
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
                            className={`${dark ? 'dark:bg-gray-700  dark:text-white' : 'bg-white text-gray-900'} mb-4 p-4 rounded-lg shadow-md hover:shadow-lg transition-all`}
                          >
                            <div className='flex justify-between items-center'>
                              <div className='font-bold  text-lg'>
                                {groupedItem.totalQty}× {groupedItem.name}
                              </div>
                              <div className='flex gap-2'>
                                <button
                                  className='w-10 h-10 gradient-danger text-white rounded-lg hover:scale-110 flex items-center justify-center font-bold shadow-md transition-all'
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
                                  className='w-10 h-10 gradient-success text-white rounded-lg hover:scale-110 flex items-center justify-center font-bold shadow-md transition-all'
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
                      dark={dark}
                    />
                  ))}

                  <button
                    className='w-full p-4 btn-gradient text-white font-bold shadow-lg hover:scale-105 transition-all'
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

                  <h2 className='text-xl font-bold mt-2 text-gray-800 dark:text-gray-200'>
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

                    <div className='text-right font-bold text-lg pt-3 text-gray-900 dark:text-gray-100'>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
