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
