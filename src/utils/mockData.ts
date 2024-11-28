import { IProduct, IStaff } from './types';
import { IItem } from './types';
import { ITable } from './types';
import { IOrder } from './types';

const tables: ITable[] = [
  { id: 't1', number: '1' },
  { id: 't2', number: '2' },
  { id: 't3', number: '3' },
  { id: 't4', number: '4' },
  { id: 't5', number: '5' },
  { id: 't6', number: '6' },
  { id: 't7', number: '7' },
  { id: 't8', number: '8' },
  { id: 't9', number: '9' },
  { id: 't10', number: '10' },
];

const staff: IStaff[] = [
  { id: 's1', name: 'Alice' },
  { id: 's2', name: 'Bob' },
  { id: 's3', name: 'Charlie' },
  { id: 's4', name: 'Diana' },
  { id: 's5', name: 'Eve' },
  { id: 's6', name: 'Frank' },
  { id: 's7', name: 'Grace' },
  { id: 's8', name: 'Hank' },
  { id: 's9', name: 'Ivy' },
  { id: 's10', name: 'Jack' },
];

const products: IProduct[] = [
  { id: 'p1', name: 'Café', descr: 'Café expresso', price: 5.0, estoq: 50 },
  { id: 'p2', name: 'Chá', descr: 'Chá de camomila', price: 4.5, estoq: 30 },
  { id: 'p3', name: 'Suco', descr: 'Suco de laranja', price: 6.0, estoq: 20 },
  { id: 'p4', name: 'Água', descr: 'Água mineral', price: 2.5, estoq: 100 },
  {
    id: 'p5',
    name: 'Sanduíche',
    descr: 'Sanduíche natural',
    price: 8.0,
    estoq: 15,
  },
  {
    id: 'p6',
    name: 'Salada',
    descr: 'Salada de frutas',
    price: 7.0,
    estoq: 10,
  },
  { id: 'p7', name: 'Bolo', descr: 'Bolo de chocolate', price: 10.0, estoq: 8 },
  { id: 'p8', name: 'Torta', descr: 'Torta de limão', price: 12.0, estoq: 5 },
  { id: 'p9', name: 'Pizza', descr: 'Pizza margherita', price: 20.0, estoq: 4 },
  {
    id: 'p10',
    name: 'Hambúrguer',
    descr: 'Hambúrguer artesanal',
    price: 15.0,
    estoq: 10,
  },
];

const items: IItem[] = [
  { id: 'i1', orderId: 'o1', staffId: 's1', productId: 'p1', quant: 2 },
  { id: 'i2', orderId: 'o1', staffId: 's2', productId: 'p3', quant: 1 },
  { id: 'i3', orderId: 'o2', staffId: 's3', productId: 'p4', quant: 3 },
  { id: 'i4', orderId: 'o2', staffId: 's4', productId: 'p6', quant: 2 },
  { id: 'i5', orderId: 'o3', staffId: 's1', productId: 'p2', quant: 1 },
  { id: 'i6', orderId: 'o3', staffId: 's5', productId: 'p8', quant: 1 },
  { id: 'i7', orderId: 'o4', staffId: 's2', productId: 'p9', quant: 2 },
  { id: 'i8', orderId: 'o4', staffId: 's3', productId: 'p5', quant: 1 },
  { id: 'i9', orderId: 'o5', staffId: 's4', productId: 'p7', quant: 1 },
  { id: 'i10', orderId: 'o5', staffId: 's5', productId: 'p10', quant: 1 },
];

const orders: IOrder[] = [
  {
    id: 'o1',
    date: '2024-11-25',
    tableId: 't1',
    isActive: true,
    items: [items[0], items[1]],
  },
  {
    id: 'o2',
    date: '2024-11-25',
    tableId: 't2',
    isActive: true,
    items: [items[2], items[3]],
  },
  {
    id: 'o3',
    date: '2024-11-26',
    tableId: 't3',
    isActive: false,
    items: [items[4], items[5]],
  },
  {
    id: 'o4',
    date: '2024-11-26',
    tableId: 't4',
    isActive: true,
    items: [items[6], items[7]],
  },
  {
    id: 'o5',
    date: '2024-11-26',
    tableId: 't5',
    isActive: true,
    items: [items[8], items[9]],
  },
  { id: 'o6', date: '2024-11-26', tableId: 't6', isActive: false, items: [] },
  { id: 'o7', date: '2024-11-27', tableId: 't7', isActive: true, items: [] },
  { id: 'o8', date: '2024-11-27', tableId: 't8', isActive: false, items: [] },
  { id: 'o9', date: '2024-11-27', tableId: 't9', isActive: true, items: [] },
  { id: 'o10', date: '2024-11-27', tableId: 't10', isActive: false, items: [] },
];

export const getTable = async (): Promise<ITable[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return tables;
};

export const createTable = async (data: ITable): Promise<ITable> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  tables.push(data);
  return data;
};

export const getStaff = async (): Promise<IStaff[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return staff;
};

export const createStaff = async (data: IStaff): Promise<IStaff> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  staff.push(data);
  return data;
};

export const getItem = async (): Promise<IItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return items;
};

export const createItem = async (data: IItem): Promise<IItem> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  items.push(data);
  return data;
};

export const getOrder = async (): Promise<IOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return orders;
};

export const createOrder = async (data: IOrder): Promise<IOrder> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  orders.push(data);
  return data;
};

export const getProduct = async (): Promise<IProduct[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return products;
};

export const createProduct = async (data: IProduct): Promise<IProduct> => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  products.push(data);
  return data;
};
