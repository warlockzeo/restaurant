import React from 'react';

import { TablesWrap } from './MesasStyle';

import { useQuery } from '@tanstack/react-query';
import { getTable } from '@/utils/mockData';
import { ITable } from '@/utils/types';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/Loader/Loader';

const Mesas = () => {
  const params = useParams();
  const { idStaff } = params;
  const navigate = useNavigate();

  const { data: tables, isLoading } = useQuery({
    queryKey: ['Tables'],
    queryFn: async () => {
      const response = await getTable();
      return response;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TablesWrap>
      {tables?.map((table: ITable) => (
        <button
          key={table.id}
          onClick={() => navigate(`/pedido/${idStaff}/${table.id}`)}
        >
          {table.number}
        </button>
      ))}
    </TablesWrap>
  );
};

export default Mesas;
