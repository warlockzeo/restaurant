import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <>
      <h1>Desculpe, você não tem autorização para acessar esta página!</h1>
      <h2>
        Se quiser fazer login, clique <Link to='/login'>aqui</Link>
      </h2>
    </>
  );
}

export default Unauthorized;
