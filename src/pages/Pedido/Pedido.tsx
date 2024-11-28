import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOrder, getOrder, getProduct } from '@/utils/mockData';
import { IItem, IOrder } from '@/utils/types';
import Loader from '@/components/Loader/Loader';
import { PedidoWrap } from './PedidoStyle';
import OrderSummary from '@/components/OrderSummary/OrderSummary';

const Pedido = () => {
  const params = useParams();
  const { idMesa, idStaff } = params;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [currentOrder, setCurrentOrder] = useState<IItem[]>([]);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['Products'],
    queryFn: async () => {
      const response = await getProduct();
      return response;
    },
  });

  const { data: allOrders = [], isLoading: isLoadingPedidos } = useQuery({
    queryKey: ['Orders'],
    queryFn: async () => {
      const response = await getOrder();
      return response;
    },
  });

  const orders: IOrder = allOrders?.filter(
    (order) => order.tableId === idMesa && order.isActive === true
  )?.[0] || {
    id: '99',
    date: String(new Date()),
    tableId: idMesa!,
    isActive: true,
    items: [],
  };

  // MUTATION
  const { mutateAsync: createOrderFn } = useMutation({
    mutationFn: createOrder,
    onSuccess(_, variables) {
      queryClient.setQueryData(['Orders'], (data: IOrder[]) => {
        return [variables];
      });
    },
  });
  // FIM MUTATION

  // função que chama a mutation
  const handleCreatePost = async () => {
    try {
      await createOrderFn({
        id: '99',
        tableId: idMesa!,
        items: [...orders!.items, ...currentOrder],
        isActive: true,
        date: '',
      }).then(() => setCurrentOrder([]));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = (productId: string) => {
    const newItem: IItem = {
      id: '99',
      orderId: orders!.id,
      productId: productId,
      quant: 1,
      staffId: idStaff!,
    };

    setCurrentOrder((prev) => [...prev, newItem]);
  };

  const getProductName = (id: string) =>
    products?.find((product) => product.id === id)?.name;

  useEffect(() => {
    if (!idStaff) {
      navigate(`/staff`);
    }

    if (!idMesa) {
      navigate(`/mesas/${idStaff}`);
    }
  }, [idMesa, idStaff, navigate]);

  if (isLoadingPedidos) {
    return <Loader />;
  }

  return (
    <>
      <PedidoWrap>
        <>
          {/* itens do menu com categoria e subcategoria */}
          {isLoadingProducts ? (
            <Loader />
          ) : (
            <div className='flex flex-col gap-1'>
              {products?.map((product, index) => (
                <button key={index} onClick={() => handleAddItem(product.id)}>
                  {product.name}
                </button>
              ))}
            </div>
          )}

          <OrderSummary data={orders.items} products={products} />

          {/* Itens adicionados por último ao pedido */}
          <div className='flex flex-1 flex-col justify-between gap-1 overflow-hidden'>
            <ul className='overflow-y-auto' style={{ flex: '0 0 40%' }}>
              {currentOrder?.map((item, index) => (
                <li key={index}>{getProductName(item.productId)}</li>
              ))}
            </ul>
            <button onClick={handleCreatePost} disabled={!currentOrder.length}>
              Adicionar
            </button>
          </div>

          {/* todos os itens do pedido */}

          {/* <div className='absolute bottom-0 left-0 bg-red-50 overflow-auto w-full h-20 p-2'>
          <h1 className='font-bold'>Pedidos da Mesa {idMesa}</h1>
          <ul>
            {orders?.items?.map((item: IItem, index: number) => (
              <li key={index}>{getProductName(item.productId)}</li>
            ))}
          </ul>
        </div> */}
        </>
      </PedidoWrap>
    </>
  );
};

export default Pedido;
