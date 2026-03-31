import React from 'react';
import { OrderItemRow } from '../OrderItemRow/OrderItemRow';
import { Order } from '../../utils/types';

interface CheckoutProps {
  activeTable: string;
  order: Order;
  dark?: boolean;
  onCloseCheckout: () => void;
  onFreeTable: () => void;
  onPrintBill: (order: Order, tableId: string) => void;
}

const total = (order: Order): number =>
  order.items.reduce((s, i) => s + i.price * i.qty, 0);

export const Checkout: React.FC<CheckoutProps> = ({
  activeTable,
  order,
  dark = false,
  onCloseCheckout,
  onFreeTable,
  onPrintBill,
}) => {
  return (
    <div className='transition-opacity duration-500'>
      <button
        className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
        onClick={onCloseCheckout}
      >
        ← Voltar ao Pedido
      </button>

      <h2 className='text-xl font-bold mt-2 text-gray-800 dark:text-gray-200'>
        Conta da Mesa {activeTable}
      </h2>

      <div
        className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6 mt-4`}
      >
        <div className='space-y-2 mb-4'>
          {order.items.map((i) => (
            <OrderItemRow
              key={i.id}
              item={i}
              onIncrease={() => {}}
              onDecrease={() => {}}
              onDelete={() => {}}
              showPrice={true}
            />
          ))}
        </div>

        <div className='border-t pt-4 mt-4'>
          <div className='flex justify-between items-center text-xl font-bold mb-4'>
            <span>Total:</span>
            <span className='text-2xl'>€ {total(order).toFixed(2)}</span>
          </div>

          <div className='flex gap-2'>
            <button
              className='flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors'
              onClick={() => onPrintBill(order, activeTable)}
            >
              Imprimir Conta
            </button>
            <button
              className='flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors'
              onClick={onFreeTable}
            >
              Liberar Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
