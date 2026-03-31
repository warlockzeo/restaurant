export const categs = ['Comida', 'Bebida', 'Sobremesa', 'Café'] as const;
export type Category = (typeof categs)[number];

export type Table = { id: string; name: string };
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  type: Category;
};
export type OrderItem = MenuItem & { qty: number; staff: string };
export type Order = {
  items: OrderItem[];
  createdAt: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  password: string;
  name: string;
  role: 'admin' | 'waiter';
};
