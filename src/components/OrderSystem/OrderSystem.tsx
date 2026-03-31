import React from 'react';
import { TableSelection } from '../TableSelection/TableSelection';
import { OrderScreen } from '../OrderScreen/OrderScreen';
import { Checkout } from '../Checkout/Checkout';
import { MenuItem, Order, Category } from '../../utils/types';

type OrdersMap = Record<string, Order>;

interface OrderSystemProps {
  tables: Array<{ id: string; name: string }>;
  menu: MenuItem[];
  categories: Category[];
  orders: OrdersMap;
  activeTable: string;
  showCheckout: boolean;
  activeStaff: string;
  dark?: boolean;
  onSelectTable: (tableId: string) => void;
  onAddItem: (tableId: string, product: MenuItem) => void;
  onDeleteItem: (tableId: string, itemId: string) => void;
  onChangeQty: (tableId: string, itemId: string, delta: number) => void;
  onLeaveTable: () => void;
  onCheckout: () => void;
  onCloseCheckout: () => void;
  onFreeTable: () => void;
  onPrintBill: (order: Order, tableId: string) => void;
}

export const OrderSystem: React.FC<OrderSystemProps> = ({
  tables,
  menu,
  categories,
  orders,
  activeTable,
  showCheckout,
  activeStaff,
  dark = false,
  onSelectTable,
  onAddItem,
  onDeleteItem,
  onChangeQty,
  onLeaveTable,
  onCheckout,
  onCloseCheckout,
  onFreeTable,
  onPrintBill,
}) => {
  return (
    <div className='space-y-4'>
      {/* STEP 1 - SELECT TABLE */}
      {!activeTable && !showCheckout && (
        <TableSelection
          tables={tables}
          orders={orders}
          onSelectTable={onSelectTable}
          dark={dark}
        />
      )}

      {/* STEP 2 - ORDER SCREEN */}
      {activeTable && !showCheckout && (
        <OrderScreen
          activeTable={activeTable}
          orders={orders}
          menu={menu}
          categories={categories}
          activeStaff={activeStaff}
          dark={dark}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
          onChangeQty={onChangeQty}
          onLeaveTable={onLeaveTable}
          onCheckout={onCheckout}
        />
      )}

      {/* CHECKOUT */}
      {showCheckout && activeTable && (
        <Checkout
          activeTable={activeTable}
          order={orders[activeTable]}
          dark={dark}
          onCloseCheckout={onCloseCheckout}
          onFreeTable={onFreeTable}
          onPrintBill={onPrintBill}
        />
      )}
    </div>
  );
};
