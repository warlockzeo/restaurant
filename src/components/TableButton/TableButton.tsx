import React from 'react';
import { Table } from '../../utils/types';

type Props = {
  table: Table;
  isActive: boolean;
  onClick: () => void;
  occupied: boolean;
};

export const TableButton: React.FC<Props> = ({ table, onClick, occupied }) => (
  <button
    className={`table-card w-full p-4 rounded-xl shadow-lg flex justify-between items-center hover:scale-105 transition-all ${
      occupied ? 'occupied' : ''
    }`}
    onClick={onClick}
  >
    <span className='font-bold text-lg'>{table.name}</span>
    <span className='text-2xl'>➡️</span>
  </button>
);
