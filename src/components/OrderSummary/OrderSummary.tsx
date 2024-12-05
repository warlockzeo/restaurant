import { IItem, IProduct } from '@/utils/types';
import React, { useState } from 'react';

const OrderSummary = ({
  data,
  products,
  onSubmit,
}: {
  data: IItem[];
  products: IProduct[];
  onSubmit: () => {};
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const getProductName = (id: string) =>
    products?.find((product) => product.id === id)?.name;

  const pedidoLength = () => data.reduce((a, c) => a + c.quant, 0);

  const result = [...new Set(data.map((x) => x.productId))].map((x) => {
    return {
      productId: x,
      quant: data
        .filter((d) => d.productId === x)
        .reduce((a, c) => a + c.quant, 0),
    };
  });

  const handleSnSubmit = () => {
    setShowSummary(false);
    onSubmit();
  };
  return (
    <>
      <div
        className='fixed bottom-2 right-2 rounded-full bg-orange-500 w-10 h-10 justify-center flex items-center cursor-pointer z-50'
        onClick={() => setShowSummary(!showSummary)}
      >
        {pedidoLength()}
      </div>
      <div
        className={`absolute top-0 right-0 flex items-center flex-col gap-3 pt-3 ${
          showSummary ? 'w-full h-full bg-black/80' : ''
        }`}
        onClick={() => setShowSummary(!showSummary)}
      >
        {showSummary ? (
          <div className='p-2 rounded-xl bg-orange-500 w-[80%] min-h-[50%] flex flex-col justify-between'>
            <ul>
              {result.map((r) => (
                <li className='text-xl'>
                  {r.quant} - {getProductName(r.productId)}
                </li>
              ))}
            </ul>

            <button onClick={handleSnSubmit} disabled={!data.length}>
              Adicionar
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default OrderSummary;
