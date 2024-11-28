import React from 'react';

import { LoaderWrap } from './LoaderStyle';

const Loader = ({ isLoading = true }: { isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <LoaderWrap>
        <div className='loader'>Carregando ...</div>
      </LoaderWrap>
    );
  }
  return null;
};

export default Loader;
