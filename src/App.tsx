// import { Link } from 'react-router-dom';
// import './App.css';
// import QRCode from 'react-qr-code';

// function App() {
//   // const os = require('os');

//   // const networkInterfaces = os.networkInterfaces();
//   // const ip = networkInterfaces['eth0'][0]['address'];

//   // console.log(ip);

//   return (
//     <div className='flex-1 flex flex-col w-full h-auto m-0 ml-auto mr-auto max-w-52 text-center'>
//       <QRCode
//         size={256}
//         style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
//         value={'http://192.168.0.106:3000/staff'}
//         viewBox={`0 0 256 256`}
//       />

//       <Link to={'/staff'}>
//         <button className='rounded-lg bg-green-500 p-4 m-0 mt-4 w-full text-white hover:bg-green-400'>
//           Inicio
//         </button>
//       </Link>
//     </div>
//   );
// }

// export default App;

// Novo layout com tema escuro, menu por categorias e dashboard em tempo real
// (React + Tailwind + Arrow Functions)

// Novo layout com tema escuro, menu por categorias e dashboard em tempo real — agora em TypeScript
// (React + Tailwind + Arrow Functions)

import React, { useState, useEffect } from 'react';

type Table = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  type: 'Comida' | 'Bebida';
};

type OrderItem = MenuItem & {
  qty: number;
};

type Order = {
  waiterId: string | null;
  items: OrderItem[];
  createdAt: number;
};

const SAMPLE_TABLES: Table[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `T${i + 1}`,
  name: `Mesa ${i + 1}`,
}));

const SAMPLE_MENU: MenuItem[] = [
  { id: 'p1', name: 'Pão de Alho', price: 4.5, type: 'Comida' },
  { id: 'p2', name: 'Salada Caesar', price: 18, type: 'Comida' },
  { id: 'p3', name: 'Parmegiana', price: 28, type: 'Comida' },
  { id: 'b1', name: 'Refrigerante', price: 6, type: 'Bebida' },
  { id: 'b2', name: 'Cerveja', price: 8, type: 'Bebida' },
  { id: 'b3', name: 'Água', price: 4, type: 'Bebida' },
];

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
  const [dark, setDark] = useState(false);
  const [tables] = useState<Table[]>(SAMPLE_TABLES);
  const [menu] = useState<MenuItem[]>(SAMPLE_MENU);
  const [orders, setOrders] = useState<OrdersMap>(
    () => loadState().orders || {}
  );

  const [activeTable, setActiveTable] = useState<string>('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [dashboard, setDashboard] = useState(false);

  useEffect(() => saveState({ orders }), [orders]);

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

  const deleteItem = (tableId: string, product: MenuItem) => {
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
              `<li>${i.qty}× ${i.name} — R$ ${(i.qty * i.price).toFixed(
                2
              )}</li>`
          )
          .join('')}
      </ul>
      <h2>Total: R$ ${total(order).toFixed(2)}</h2>
    `);
    win.print();
  };

  const categories: Array<'Comida' | 'Bebida'> = ['Comida', 'Bebida'];

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 p-4 pb-20'>
        {/* HEADER */}
        <div className='flex justify-between mb-4'>
          <h1 className='text-2xl font-bold'>🍽️ Sistema de Pedidos</h1>
          <button
            className='px-3 py-1 rounded-lg bg-gray-800 text-white text-sm'
            onClick={() => setDark(!dark)}
          >
            {dark ? '🌞 Claro' : '🌙 Escuro'}
          </button>
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
                        ? 'bg-green-600 text-white'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className='font-bold'>{t.name}</div>
                    <div className='text-sm mt-1'>
                      {order ? (
                        <>
                          <div>Itens: {order.items.length}</div>
                          <div>Total: R$ {total(order).toFixed(2)}</div>
                        </>
                      ) : (
                        <span className='text-gray-500 dark:text-gray-400'>
                          Livre
                        </span>
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
                  <button
                    key={t.id}
                    className='w-full p-3 rounded-xl bg-white dark:bg-gray-800 shadow hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between'
                    onClick={() => {
                      createOrder(t.id);
                      setActiveTable(t.id);
                    }}
                  >
                    <span>{t.name}</span>
                    <span>➡️</span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 2 - ORDER SCREEN */}
            {activeTable && !showCheckout && (
              <div className='space-y-4 animate-fadeIn'>
                <button
                  className='text-sm underline'
                  onClick={() => setActiveTable('')}
                >
                  ← Trocar Mesa
                </button>

                <h2 className='text-xl font-semibold'>Mesa {activeTable}</h2>

                {/* ORDER ITEMS */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'>
                  <h3 className='font-semibold mb-2'>Itens do Pedido</h3>
                  {orders[activeTable].items.length === 0 && (
                    <p className='text-sm text-gray-500'>Nenhum item ainda.</p>
                  )}

                  {orders[activeTable].items.map((i) => (
                    <div
                      key={i.id}
                      className='flex justify-between py-2 border-b border-gray-300 dark:border-gray-700 text-sm'
                    >
                      <span>
                        {i.qty}× {i.name}
                      </span>
                      <span>R$ {(i.price * i.qty).toFixed(2)}</span>
                      <button
                        key={i.id}
                        className='p-3 bg-indigo-600 text-white rounded-xl shadow active:scale-95'
                        onClick={() => deleteItem(activeTable, i)}
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <div className='text-right font-bold pt-2'>
                    Total: R$ {total(orders[activeTable]).toFixed(2)}
                  </div>
                </div>

                {/* MENU CATEGORIES */}
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'
                  >
                    <h3 className='font-semibold mb-3'>{cat}</h3>
                    <div className='grid grid-cols-2 gap-3'>
                      {menu
                        .filter((p) => p.type === cat)
                        .map((p) => (
                          <button
                            key={p.id}
                            className='p-3 bg-indigo-600 text-white rounded-xl shadow active:scale-95'
                            onClick={() => addItem(activeTable, p)}
                          >
                            <div className='font-medium text-sm'>{p.name}</div>
                            <div className='text-xs opacity-80'>
                              R$ {p.price.toFixed(2)}
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}

                <button
                  className='w-full p-4 rounded-xl bg-green-600 text-white font-bold shadow'
                  onClick={() => setShowCheckout(true)}
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
                    <div
                      key={i.id}
                      className='flex justify-between py-2 border-b border-gray-300 dark:border-gray-700 text-sm'
                    >
                      <span>
                        {i.qty}× {i.name}
                      </span>
                      <span>R$ {(i.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className='text-right font-bold text-lg pt-3'>
                    Total: R$ {total(orders[activeTable]).toFixed(2)}
                  </div>

                  <button
                    className='w-full mt-4 p-4 rounded-xl bg-blue-700 text-white font-bold shadow'
                    onClick={() => printBill(orders[activeTable], activeTable)}
                  >
                    🖨️ Imprimir Conta
                  </button>

                  <button
                    className='w-full mt-2 p-4 rounded-xl bg-gray-500 text-white font-bold shadow'
                    onClick={() => {
                      const updated = { ...orders };
                      delete updated[activeTable];
                      setOrders(updated);
                      setActiveTable('');
                      setShowCheckout(false);
                    }}
                  >
                    ✔️ Fechar Mesa
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
