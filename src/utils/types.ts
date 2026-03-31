export interface ITable {
  id: string;
  number: string;
}

export interface IStaff {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  descr: string;
  price: number;
  estoq: number;
}

export interface IItem {
  id: string;
  orderId: string;
  staffId: string;
  productId: string;
  quant: number;
}

export interface IOrder {
  id: string;
  date: string;
  tableId: string;
  isActive: boolean;
  items: IItem[];
}

//=====================================

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
  waiterId: string | null;
  items: OrderItem[];
  createdAt: number;
};

export type User = {
  id: string;
  username: string;
  email?: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
};
