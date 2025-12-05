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
    className={`w-full p-3 rounded-xl shadow flex justify-between ${
      occupied ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
    }`}
    onClick={onClick}
  >
    <span>{table.name}</span>
    <span>➡️</span>
  </button>
);
