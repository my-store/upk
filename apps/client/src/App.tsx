import { disconnected } from './libs/redux/reducers/socket.slice';
import { useDispatch, useSelector } from 'react-redux';
import { FirstLoading } from './components/loading';
import type { RootState } from './libs/redux/store';
import { useEffect, useState } from 'react';
import { Error, Log } from './libs/console';
import Alert from './components/alert';
import { io } from 'socket.io-client';
import Login from './pages/login';
import Admin from './pages/admin';
import Kasir from './pages/kasir';
import User from './pages/user';
import {
  getLoginCredentials,
  getAuthProfile,
  refreshToken,
} from './libs/credentials';
import './App.scss';

// Server configuration (this must be matched with api/.env file)
const serverUrl: string = 'http://localhost:5000';

function App() {
  const [page, setPage] = useState(null as any);
  const state = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  function openLoginPage() {
    setPage(<Login Callback={checkCredentials} serverUrl={serverUrl} />);
  }

  async function checkToken(cred: any) {
    // Important token | login data
    const { access_token, role, data } = cred;

    // If important data is not valid
    if (!access_token || !role || !data) {
      // Force open login page
      return openLoginPage();
    }

    // Check login-profile
    const profile = await getAuthProfile(access_token);
    if (!profile) {
      // Dispay error message
      Error('Token expired');

      // Token expired, refresh token
      const tokenRefreshed = await refreshToken(data.tlp);
      // Token refresh failed
      if (!tokenRefreshed) {
        // Terminate process and force to open login page
        return openLoginPage();
      }

      // Re-check credentials
      return checkCredentials();
    }

    // SOCKET INSTANCE
    const socket = io(serverUrl);

    /*
    | --------------------------------------------------------------------
    | WHEN I'AM IS CONNECTED TO SOCKET SERVER
    | --------------------------------------------------------------------
    | Get my login data in local-storage and sent to server for broadcast
    */
    socket.on('connect', () => {
      // Get my login data
      const { data, role } = getLoginCredentials();
      // Broadcast to other, that i'm is online now
      socket.emit('online', { tlp: data.tlp, role });
    });

    // When socket is disconected
    socket.on('disconnect', () => {
      dispatch(disconnected());
    });

    // Buka halaman sesuai tipe/role login
    if (role == 'Admin') {
      setPage(
        <Admin
          openLoginPage={openLoginPage}
          serverUrl={serverUrl}
          socket={socket}
        />,
      );
    } else if (role == 'User') {
      setPage(
        <User
          openLoginPage={openLoginPage}
          serverUrl={serverUrl}
          socket={socket}
        />,
      );
    } else if (role == 'Kasir') {
      setPage(<Kasir />);
    }
  }

  function checkCredentials() {
    // Dispay progress message
    Log('Checking login credentials');

    // Find login data on local-storage
    const loginCredentials = getLoginCredentials();

    // User NOT signed-in
    if (!loginCredentials) {
      // Dispay error message
      Error('No login credentials detected');

      // Force open login page
      return openLoginPage();
    }

    // Already signed-in, execute token checker
    checkToken(loginCredentials);
  }

  useEffect(() => {
    checkCredentials();
  }, []);

  return (
    <div className="App">
      {state.isLoading && (
        <FirstLoading serverUrl={serverUrl} easing="ease-in-out" />
      )}
      <Alert />
      {page}
    </div>
  );
}

export default App;
