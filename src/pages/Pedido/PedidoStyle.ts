import styled from 'styled-components';

export const PedidoWrap = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  flex: 1;

  button {
    border-radius: 15px;
    background-color: #ccc;

    &:hover {
      background-color: blue;
      color: white;
    }
  }
`;
