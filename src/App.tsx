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
  const [activeWaiter, setActiveWaiter] = useState<string>('');
  const [activeTable, setActiveTable] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [dashboard, setDashboard] = useState(false);

  console.log(waiters);
  useEffect(() => saveState({ orders }), [orders]);
  useEffect(() => {
    if (dashboard) {
      setActiveTable('');
    }
  }, [dashboard]);
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
    const existing = order.items.find((i) => i.id === product.id);
    if (existing) existing.qty++;
    else order.items.push({ ...product, qty: 1 });

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
              `<li>${i.qty}× ${i.name} — € ${(i.qty * i.price).toFixed(2)}</li>`,
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
      {!activeWaiter ? (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4'>
          <div className='space-y-3 animate-fadeIn'>
            <h1 className='text-2xl font-bold text-center mb-6'>
              🍽️ Sistema de Pedidos
            </h1>
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
        </div>
      ) : (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4 pb-20'>
          <div className='mb-4 text-center'>
            <span className='text-sm text-gray-600'>
              Funcionário: {activeWaiter}
            </span>
          </div>
          {/* DASHBOARD BUTTON */}
          <button
            className='mb-4 w-full p-3 bg-indigo-600 text-white rounded-xl shadow'
            onClick={() => setDashboard(!dashboard)}
          >
            {dashboard ? 'Voltar ao Sistema' : 'Abrir Dashboard'}
          </button>

          {/* DASHBOARD */}
          {dashboard && (
            <div className='animate-fadeIn space-y-4'>
              <h2 className='text-xl font-semibold'>📊 Status das Mesas</h2>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {tables.map((t) => {
                  const order = orders[t.id];
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-xl shadow ${
                        order
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      <div className='font-bold'>{t.name}</div>
                      <div className='text-sm mt-1'>
                        {order ? (
                          <>
                            <div>Itens: {order.items.length}</div>
                            <div>Total: € {total(order).toFixed(2)}</div>
                          </>
                        ) : (
                          <span className='text-white-500'>Livre</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SISTEMA DE PEDIDOS */}
          {!dashboard && (
            <>
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
                    className='text-sm underline'
                    onClick={() => leaveTable()}
                  >
                    ← Trocar Mesa
                  </button>

                  <h2 className='text-xl font-semibold'>Mesa {activeTable}</h2>

                  {/* ORDER ITEMS */}
                  <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'>
                    <h3 className='font-semibold mb-2'>Itens do Pedido</h3>
                    {orders[activeTable].items.length === 0 && (
                      <p className='text-sm text-gray-500'>
                        Nenhum item ainda.
                      </p>
                    )}

                    {orders[activeTable].items.map((i) => (
                      <OrderItemRow
                        item={i}
                        onDecrease={() => changeQty(activeTable, i.id, -1)}
                        onDelete={() => deleteItem(activeTable, i.id)}
                        onIncrease={() => changeQty(activeTable, i.id, 1)}
                      />
                    ))}
                  </div>

                  {/* MENU CATEGORIES */}
                  {categories.map((cat) => (
                    <MenuCategory
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
                    className='text-sm underline'
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
