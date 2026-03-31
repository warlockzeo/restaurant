import React, { useState, useEffect } from 'react';
import { SAMPLE_MENU, SAMPLE_TABLES } from './utils/mockData';
import { categs, Table, MenuItem, Order, OrderItem } from './utils/types';
import { Dashboard } from './components/Dashboard/Dashboard';
import { OrderSystem } from './components/OrderSystem/OrderSystem';
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

      const targetItem = order.items.find((i) => i.id === itemId);
      if (!targetItem) return prev;

      if (delta > 0) {
        // Ao aumentar: criar um novo item com staff
        const newItem = {
          ...targetItem,
          qty: 1,
          id: `${targetItem.id}_${Date.now()}_${Math.random()}`,
          staff: activeWaiter,
        };
        const updated = [...order.items, newItem];
        return { ...prev, [tableId]: { ...order, items: updated } };
      } else {
        // Ao diminuir: remover um item (se houver mais de 1)
        const itemsToRemove = order.items.filter(
          (i) => i.name === targetItem.name,
        );
        if (itemsToRemove.length > 1) {
          // Remove o último item adicionado
          const updated = order.items.filter((i) => i.id !== itemId);
          return { ...prev, [tableId]: { ...order, items: updated } };
        }
        return prev; // Não permite remover o último item
      }
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
          // DASHBOARD
          <div className='transition-opacity duration-500 space-y-4'>
            <Dashboard
              orders={orders}
              selectedTable={selectedDashboardTable}
              onTableSelect={setSelectedDashboardTable}
              tables={tables}
              dark={dark}
            />
          </div>
        ) : (
          // SISTEMA DE PEDIDOS
          <OrderSystem
            tables={tables}
            menu={menu}
            categories={[...categs]}
            orders={orders}
            activeTable={activeTable}
            showCheckout={showCheckout}
            activeWaiter={activeWaiter}
            dark={dark}
            onSelectTable={(tableId) => {
              createOrder(tableId);
              setActiveTable(tableId);
            }}
            onAddItem={addItem}
            onDeleteItem={deleteItem}
            onChangeQty={changeQty}
            onLeaveTable={leaveTable}
            onCheckout={() => setShowCheckout(true)}
            onCloseCheckout={() => setShowCheckout(false)}
            onFreeTable={freeTable}
            onPrintBill={printBill}
          />
        )}
      </div>
    </div>
  );
};

export default App;
