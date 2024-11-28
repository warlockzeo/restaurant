import React from 'react';

import { StaffWrap } from './StaffStyle';

import { useQuery } from '@tanstack/react-query';
import { getStaff } from '@/utils/mockData';
import { IStaff } from '@/utils/types';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader/Loader';

const Staff = () => {
  const navigate = useNavigate();

  const { data: staffs, isLoading } = useQuery({
    queryKey: ['Staffs'],
    queryFn: async () => {
      const response = await getStaff();
      return response;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <StaffWrap>
      {staffs?.map((staff: IStaff) => (
        <button key={staff.id} onClick={() => navigate(`/mesas/${staff.id}`)}>
          {staff.name}
        </button>
      ))}
    </StaffWrap>
  );
};

export default Staff;
