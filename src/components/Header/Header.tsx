// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const Header = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <div className='p-3 flex justify-between'>
//       logo
//       {location.pathname !== '/' && (
//         <button onClick={() => navigate(-1)} className='text-lg'>
//           Voltar
//         </button>
//       )}
//     </div>
//   );
// };

// export default Header;

import React from 'react';

type Props = { dark?: boolean; setDark?: (d: boolean) => void };

export const Header: React.FC<Props> = ({ dark = false, setDark }) => (
  <div className='flex justify-between mb-4'>
    <h1 className='text-2xl font-bold'>🍽️ Sistema de Pedidos</h1>
    {!!setDark ? (
      <button
        className='px-3 py-1 rounded-lg bg-gray-800 text-white text-sm'
        onClick={() => setDark(!dark)}
      >
        {dark ? '🌞 Claro' : '🌙 Escuro'}
      </button>
    ) : null}
  </div>
);
