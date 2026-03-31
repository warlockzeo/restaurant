import { MenuItem, Table } from './types';

// Mock de menu para o sistema
export const SAMPLE_MENU: MenuItem[] = [
  { id: 'p1', name: 'Pão de Alho', price: 4.5, type: 'Comida' },
  { id: 'p2', name: 'Salada Caesar', price: 18, type: 'Comida' },
  { id: 'p3', name: 'Parmegiana', price: 28, type: 'Comida' },
  { id: 'b1', name: 'Refrigerante', price: 6, type: 'Bebida' },
  { id: 'b2', name: 'Cerveja', price: 8, type: 'Bebida' },
  { id: 'b3', name: 'Água', price: 4, type: 'Bebida' },
  { id: 's1', name: 'Sorvete', price: 12, type: 'Sobremesa' },
  { id: 's2', name: 'Pudim', price: 10, type: 'Sobremesa' },
  { id: 'c1', name: 'Café Expresso', price: 5, type: 'Café' },
  { id: 'c2', name: 'Cappuccino', price: 7, type: 'Café' },
];

export const SAMPLE_TABLES: Table[] = Array.from({ length: 10 }).map(
  (_, i) => ({ id: `T${i + 1}`, name: `Mesa ${i + 1}` }),
);

// Mock de usuários para login e atendentes
export const SAMPLE_USERS = [
  {
    id: '1',
    username: 'joao',
    password: '123456',
    name: 'João Silva',
    role: 'waiter' as const,
  },
  {
    id: '2',
    username: 'maria',
    password: '123456',
    name: 'Maria Santos',
    role: 'waiter' as const,
  },
  {
    id: '3',
    username: 'pedro',
    password: '123456',
    name: 'Pedro Costa',
    role: 'waiter' as const,
  },
  {
    id: 'admin1',
    username: 'admin',
    password: '123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: 'admin2',
    username: 'warlockzeo',
    password: 'smtqsgjh',
    name: 'Mário Leandro',
    role: 'admin' as const,
  },
];

// Mock de ordens (simulando banco de dados)
export const SAMPLE_ORDERS_DB = [
  {
    id: 'order_1',
    table_id: 'T1',
    status: 'active', // active, completed, cancelled
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    updated_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
  },
  {
    id: 'order_2',
    table_id: 'T2',
    status: 'active',
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
    updated_at: new Date(Date.now() - 900000).toISOString(), // 15 minutos atrás
  },
  {
    id: 'order_3',
    table_id: 'T3',
    status: 'completed',
    created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutos atrás
    updated_at: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
  },
];

// Mock de itens de ordem (simulando banco de dados)
export const SAMPLE_ORDER_ITEMS = [
  {
    id: 'order_item_1',
    order_id: 'order_1',
    menu_item_id: 'p1',
    quantity: 2,
    staff_name: 'João Silva',
    unit_price: 4.5, // Preço no momento da venda
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'order_item_2',
    order_id: 'order_1',
    menu_item_id: 'c1',
    quantity: 3,
    staff_name: 'Maria Santos',
    unit_price: 5, // Preço no momento da venda
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'order_item_3',
    order_id: 'order_2',
    menu_item_id: 'p3',
    quantity: 1,
    staff_name: 'Pedro Costa',
    unit_price: 28, // Preço no momento da venda
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'order_item_4',
    order_id: 'order_2',
    menu_item_id: 'b2',
    quantity: 2,
    staff_name: 'João Silva',
    unit_price: 8, // Preço no momento da venda
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'order_item_5',
    order_id: 'order_3',
    menu_item_id: 's1',
    quantity: 1,
    staff_name: 'Maria Santos',
    unit_price: 12, // Preço no momento da venda
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
];

// Função para transformar dados estruturados do BD para o formato do sistema
export const transformOrderData = (orderItems: any[]) => {
  return orderItems.map((item: any) => ({
    id: item.id,
    name:
      SAMPLE_MENU.find((menu) => menu.id === item.menu_item_id)?.name ||
      'Produto Desconhecido',
    price:
      SAMPLE_MENU.find((menu) => menu.id === item.menu_item_id)?.price || 0,
    type:
      SAMPLE_MENU.find((menu) => menu.id === item.menu_item_id)?.type ||
      'Comida',
    qty: item.quantity,
    staff: item.staff_name,
    unit_price:
      item.unit_price ||
      SAMPLE_MENU.find((menu) => menu.id === item.menu_item_id)?.price ||
      0, // Preço da época da venda
  }));
};
