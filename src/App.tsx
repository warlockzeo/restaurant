import React, { useState, useEffect } from 'react';
import {
  SAMPLE_MENU,
  SAMPLE_TABLES,
  SAMPLE_ORDER_ITEMS,
  SAMPLE_ORDERS_DB,
  transformOrderData,
} from './utils/mockData';
import { categs, Table, MenuItem, Order, OrderItem } from './utils/types';
import { Dashboard } from './components/Dashboard/Dashboard';
import { OrderSystem } from './components/OrderSystem/OrderSystem';
import { useAuth } from './contexts/AuthContext';

const STORAGE_KEY = 'restaurante_layout_v4_ts';

type OrdersMap = Record<string, Order>;

const loadState = (): { orders?: OrdersMap } => {
  try {
    // Para desenvolvimento: permite carregar dados mock se não houver dados no localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { orders?: OrdersMap };
      if (parsed.orders && Object.keys(parsed.orders || {}).length > 0) {
        return parsed;
      }
    }

    // Se não houver dados, retorna vazio (inicia limpo)
    // Dados mock só são carregados quando o usuário clica no botão
    return { orders: {} };
  } catch (error) {
    console.error(' Erro ao carregar estado:', error);
    return { orders: {} };
  }
};

const saveState = (state: { orders: OrdersMap }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// Função para carregar dados mock (para testes)
const loadMockData = () => {
  // Transforma dados estruturados do BD para o formato do sistema
  const transformedOrders: Record<string, any> = {};

  // Agrupar itens por order_id
  const groupedByOrder = SAMPLE_ORDER_ITEMS.reduce(
    (acc, item) => {
      const orderId = item.order_id;
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(item);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Usar SAMPLE_ORDERS_DB para obter table_id de cada order_id
  Object.entries(groupedByOrder).forEach(([orderId, items]) => {
    const order = SAMPLE_ORDERS_DB.find((o) => o.id === orderId);
    if (order && order.status === 'active') {
      // Apenas ordens ativas
      const tableId = order.table_id;
      if (tableId && Array.isArray(items)) {
        transformedOrders[tableId] = {
          items: transformOrderData(items),
          createdAt: Date.now() - Math.random() * 3600000, // Tempo aleatório
        };
      }
    }
  });

  const mockData = { orders: transformedOrders };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  window.location.reload(); // Recarrega para carregar os dados
};

// Função para limpar todos os dados (para testes)
const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
  // Força limpeza completa sem recarregar dados mock
  window.location.reload(); // Força reload do servidor (bypass cache)
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
  const activeStaff = user?.name || '';

  // Determinar se deve mostrar dashboard ou sistema baseado no role
  const shouldShowDashboard = user?.role === 'admin';

  // Salvar preferência do modo dark
  useEffect(() => {
    sessionStorage.setItem('restaurante_dark_mode', dark.toString());
  }, [dark]);

  // Salvar pedidos no localStorage (depois de carregar os dados)
  useEffect(() => saveState({ orders }), [orders]);

  // Resetar mesa ao entrar no dashboard (depois de verificar se há dados)
  useEffect(() => {
    if (shouldShowDashboard) {
      setActiveTable('');
      // Resetar funcionário ao entrar no dashboard (não necessário mais pois usa user logado)
    }
  }, [shouldShowDashboard]);
  const createOrder = (tableId: string) => {
    if (!orders[tableId]) {
      setOrders((prev) => ({
        ...prev,
        [tableId]: {
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
      createdAt: Date.now(),
    };

    // Sempre adiciona um novo item individual para cada venda
    order.items.push({
      ...product,
      qty: 1,
      staff: activeStaff,
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
          staff: activeStaff,
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
    const order = orders[activeTable];
    if (order && order.items.length > 0) {
      // Salvar ordem como completed no histórico
      const completedOrder = {
        ...order,
        status: 'completed',
        completedAt: Date.now(),
        tableId: activeTable,
      };

      // Obter ordens completadas existentes
      const existingCompleted = JSON.parse(
        localStorage.getItem('completed_orders') || '[]',
      );
      const updatedCompleted = [...existingCompleted, completedOrder];
      localStorage.setItem(
        'completed_orders',
        JSON.stringify(updatedCompleted),
      );

      console.log('💾 Ordem salva como completed:', completedOrder);
    }

    // Remover ordem das ordens ativas
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
                {/* Botões para desenvolvimento - carregar/limpar dados mock */}
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <button
                      onClick={loadMockData}
                      className='px-3 py-2 bg-yellow-500/80 backdrop-blur-md text-white rounded-lg hover:bg-yellow-600/80 transition-all font-medium border border-yellow-400/30'
                      title='Carregar dados de exemplo para testes'
                    >
                      📊 Dados Mock
                    </button>
                    <button
                      onClick={clearAllData}
                      className='px-3 py-2 bg-red-500/80 backdrop-blur-md text-white rounded-lg hover:bg-red-600/80 transition-all font-medium border border-red-400/30'
                      title='Limpar todos os dados'
                    >
                      🗑️ Limpar
                    </button>
                  </>
                )}
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
            activeStaff={activeStaff}
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
