import { Link } from 'react-router-dom';
import './App.css';
import QRCode from 'react-qr-code';

function App() {
  // const os = require('os');

  // const networkInterfaces = os.networkInterfaces();
  // const ip = networkInterfaces['eth0'][0]['address'];

  // console.log(ip);

  return (
    <div className='flex-1 flex flex-col w-full h-auto m-0 ml-auto mr-auto max-w-52 text-center'>
      <QRCode
        size={256}
        style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
        value={'http://192.168.0.106:3000/staff'}
        viewBox={`0 0 256 256`}
      />

      <Link to={'/staff'}>
        <button className='rounded-lg bg-green-500 p-4 m-0 mt-4 w-full text-white hover:bg-green-400'>
          Inicio
        </button>
      </Link>
    </div>
  );
}

export default App;
