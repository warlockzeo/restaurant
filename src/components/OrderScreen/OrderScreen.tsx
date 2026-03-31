import React from 'react';
import { MenuCategory } from '../MenuCategory/MenuCategory';
import { MenuItem, Order, Category } from '../../utils/types';

type OrdersMap = Record<string, Order>;

interface OrderScreenProps {
  activeTable: string;
  orders: OrdersMap;
  menu: MenuItem[];
  categories: Category[];
  activeWaiter: string;
  dark?: boolean;
  onAddItem: (tableId: string, product: MenuItem) => void;
  onDeleteItem: (tableId: string, itemId: string) => void;
  onChangeQty: (tableId: string, itemId: string, delta: number) => void;
  onLeaveTable: () => void;
  onCheckout: () => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({
  activeTable,
  orders,
  menu,
  categories,
  activeWaiter,
  dark = false,
  onAddItem,
  onDeleteItem,
  onChangeQty,
  onLeaveTable,
  onCheckout,
}) => {
  const order = orders[activeTable];

  return (
    <div className='space-y-4 transition-opacity duration-500'>
      {/* ORDER ITEMS */}
      <div
        className={`${dark ? 'dark:bg-gray-800 dark:text-white' : 'card-gradient text-gray-900'} rounded-xl shadow-lg p-6`}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Itens da Mesa {activeTable}</h2>

          <button
            className='px-3 py-2 btn-gradient text-white rounded-lg hover:bg-gray-700 transition-colors font-medium'
            onClick={onLeaveTable}
          >
            ← Trocar Mesa
          </button>
        </div>
        {order.items.length === 0 && (
          <p className='text-sm  text-center py-4'>Nenhum item ainda.</p>
        )}

        {order.items.length > 0 && (
          <div className='space-y-2 mb-4'>
            {(() => {
              // Agrupar itens por nome
              const groupedItems = order.items.reduce(
                (acc, item) => {
                  if (!acc[item.name]) {
                    acc[item.name] = {
                      name: item.name,
                      price: item.price,
                      totalQty: 0,
                      itemIds: [],
                    };
                  }
                  acc[item.name].totalQty += item.qty;
                  acc[item.name].itemIds.push(item.id);
                  return acc;
                },
                {} as Record<
                  string,
                  {
                    name: string;
                    price: number;
                    totalQty: number;
                    itemIds: string[];
                  }
                >,
              );

              return Object.values(groupedItems).map((group, index) => (
                <div
                  key={group.name}
                  className={`flex justify-between py-2 text-sm ${
                    index !== Object.values(groupedItems).length - 1
                      ? 'border-b border-gray-300 dark:border-gray-700'
                      : ''
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <button
                      disabled={group.totalQty <= 1}
                      className={`px-2 bg-gray-600 text-white rounded ${
                        group.totalQty <= 1
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                      }`}
                      onClick={() => {
                        // Remove o último item do grupo
                        const lastItemId =
                          group.itemIds[group.itemIds.length - 1];
                        onDeleteItem(activeTable, lastItemId);
                      }}
                    >
                      -
                    </button>
                    <span>{group.totalQty}</span>
                    <button
                      className='px-2 bg-gray-600 text-white rounded'
                      onClick={() => {
                        // Cria um novo item do mesmo tipo
                        const newItem = {
                          id: `${group.name}_${Date.now()}_${Math.random()}`,
                          name: group.name,
                          price: group.price,
                          qty: 1,
                          staff: activeWaiter,
                          type:
                            order.items.find((i) => i.name === group.name)
                              ?.type || 'Comida',
                        };
                        onAddItem(activeTable, newItem);
                      }}
                    >
                      +
                    </button>
                    <span>{group.name}</span>
                  </div>
                  <div>
                    <button
                      className='ml-2 text-red-500 font-bold'
                      onClick={() => {
                        // Remove todos os itens do grupo
                        group.itemIds.forEach((itemId) => {
                          onDeleteItem(activeTable, itemId);
                        });
                      }}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {order.items.length > 0 && (
          <div className='border-t pt-4 mt-4'>
            <button
              className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors'
              onClick={onCheckout}
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>

      {/* MENU */}
      <div className='space-y-4'>
        {categories.map((cat) => (
          <MenuCategory
            key={cat}
            category={cat}
            items={menu.filter((p) => p.type === cat)}
            onAdd={(product) => onAddItem(activeTable, product)}
            dark={dark}
          />
        ))}
      </div>
    </div>
  );
};
