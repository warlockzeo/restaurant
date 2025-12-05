import React from 'react';
import { OrderItem } from '../../utils/types';

type Props = {
  item: OrderItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
};

export const OrderItemRow: React.FC<Props> = ({
  item,
  onIncrease,
  onDecrease,
  onDelete,
}) => (
  <div className='flex justify-between py-2 border-b border-gray-300 dark:border-gray-700 text-sm'>
    <div className='flex items-center gap-2'>
      <button
        disabled={item.qty <= 1}
        className={`px-2 bg-gray-600 text-white rounded ${
          item.qty <= 1 ? 'opacity-40 cursor-not-allowed' : ''
        }`}
        onClick={onDecrease}
      >
        -
      </button>
      <span>{item.qty}</span>
      <button
        className='px-2 bg-gray-600 text-white rounded'
        onClick={onIncrease}
      >
        +
      </button>
      <span>{item.name}</span>
    </div>
    <div>
      <span>R$ {(item.price * item.qty).toFixed(2)}</span>
      <button className='ml-2 text-red-500 font-bold' onClick={onDelete}>
        ✖
      </button>
    </div>
  </div>
);
