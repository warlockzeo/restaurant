import React from 'react';
import { TableButton } from '../TableButton/TableButton';
import { Table, Order } from '../../utils/types';

type OrdersMap = Record<string, Order>;

interface TableSelectionProps {
  tables: Table[];
  orders: OrdersMap;
  onSelectTable: (tableId: string) => void;
  dark?: boolean;
}

export const TableSelection: React.FC<TableSelectionProps> = ({
  tables,
  orders,
  onSelectTable,
  dark = false,
}) => {
  return (
    <div className='space-y-3 transition-opacity duration-500'>
      <h2 className='text-lg font-semibold '>Selecione a mesa</h2>
      {tables.map((t) => (
        <TableButton
          key={t.id}
          table={t}
          occupied={!!orders[t.id]}
          onClick={() => {
            onSelectTable(t.id);
          }}
        />
      ))}
    </div>
  );
};
