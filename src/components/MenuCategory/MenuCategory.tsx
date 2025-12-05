import React from 'react';
import { MenuItem, Category } from '../../utils/types';

type Props = {
  category: Category;
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export const MenuCategory: React.FC<Props> = ({ category, items, onAdd }) => (
  <div className='bg-white dark:bg-gray-800 rounded-xl shadow p-4'>
    <h3 className='font-semibold mb-3'>{category}</h3>
    <div className='grid grid-cols-2 gap-3'>
      {items.map((p) => (
        <button
          key={p.id}
          className='p-3 bg-indigo-600 text-white rounded-xl shadow active:scale-95'
          onClick={() => onAdd(p)}
        >
          <div className='font-medium text-sm'>{p.name}</div>
        </button>
      ))}
    </div>
  </div>
);
