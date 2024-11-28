import styled from 'styled-components';

export const LoaderWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    width: fit-content;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 30px;
    padding-bottom: 8px;
    background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
    animation: l2 2s linear infinite;
  }

  @keyframes l2 {
    to {
      background-size: 100% 3px;
    }
  }
`;
