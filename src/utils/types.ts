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
