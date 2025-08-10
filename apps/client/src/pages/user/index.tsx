import { getLoginCredentials, getUserData } from '../../libs/credentials';
import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import { setLoginData } from '../../libs/redux/reducers/login.slice';
import { BrowserRouter, Route, Routes } from 'react-router';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import type { Socket } from 'socket.io-client';
import Sidebar from './templates/sidebar';
import Footer from './templates/footer';
import Header from './templates/header';
import Inventaris from './inventaris';
import { useEffect } from 'react';
import './user.styles.main.scss';
import Laporan from './laporan';

interface UserProps {
  openLoginPage: any;
  serverUrl: string;
  socket: Socket;
}

const GlobalStyle = {
  navbarHeight: 35,
  sidebarWidth: 220,
  primaryColor: 'rgb(50, 101, 167)',
  secondaryColor: 'rgb(33, 76, 131)',
};

export default function User(props: UserProps) {
  const { serverUrl, openLoginPage, socket } = props;

  const loginState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  function onlineHandler(tlp: string) {}

  function offlineHandler(tlp: string) {}

  function socketListener() {
    /*--------------------------------------------------------------------
    | AN ADMIN DELETES USER
    | --------------------------------------------------------------------
    | If currently signed-in is user, and matched the 'tlp',
    | force this user to open login page and remove all login credentials.
    */
    socket.on('delete-user', (tlp) => {
      // Get my login data
      const { data } = getLoginCredentials();

      // My login data is deleted or admin is deletes my account
      if (!data || data.tlp == tlp) {
        // Force me to open login page (also remove login credentials)
        return openLoginPage();
      }

      // Admin deleted someone else
      // ... Do something, example: change online indicator etc.
    });

    socket.on('online', onlineHandler);
    socket.on('offline', offlineHandler);
  }

  // When the page is loaded or refreshed
  async function load() {
    socketListener();

    // Important token | login data
    const { access_token, role, data } = getLoginCredentials();

    // Get full user data
    const user = await getUserData(data.tlp, { access_token, role });

    // No user data is founded
    if (!user) {
      // Terminate task and force to open login page
      return openLoginPage();
    }

    // Set user (login) data
    dispatch(setLoginData(user));

    // Remove loading animation after 3 second
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    load();
  }, []);

  if (!loginState.loginData) return null;

  return (
    <BrowserRouter>
      <div
        className="User"
        style={{
          paddingTop: GlobalStyle.navbarHeight,
          paddingLeft: GlobalStyle.sidebarWidth,
        }}
      >
        <Header globalStyle={GlobalStyle} />
        <Sidebar
          globalStyle={GlobalStyle}
          serverUrl={serverUrl}
          userData={loginState.loginData}
        />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/inventaris" element={<Inventaris />} />
          <Route path="/laporan" element={<Laporan />} />
        </Routes>
        <Footer globalStyle={GlobalStyle} />
      </div>
    </BrowserRouter>
  );
}

function Homepage() {
  return <h1>Homepage for User</h1>;
}
