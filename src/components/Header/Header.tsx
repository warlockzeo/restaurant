import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='p-3 flex justify-between'>
      logo
      {location.pathname !== '/' && (
        <button onClick={() => navigate(-1)}>Voltar</button>
      )}
    </div>
  );
};

export default Header;
