import { getLoginCredentials, getUserData } from '../../libs/credentials';
import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import { setLoginData } from '../../libs/redux/reducers/login.slice';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import type { Socket } from 'socket.io-client';
import './styles/admin.styles.main.scss';
import AdminInsert from './insert';
import { useEffect } from 'react';

interface AdminProps {
  openLoginPage: any;
  serverUrl: string;
  socket: Socket;
}

function Home(props: AdminProps) {
  return <div className="Home"></div>;
}

function Contact(props: AdminProps) {
  return (
    <div className="Contact">
      <h1>Contact</h1>
    </div>
  );
}

function About(props: AdminProps) {
  return (
    <div className="About">
      <h1>About</h1>
    </div>
  );
}

export default function Admin(props: AdminProps) {
  const { openLoginPage, socket } = props;

  const loginState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  function onlineHandler(tlp: string) {}

  function offlineHandler(tlp: string) {}

  function socketListener() {
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
      <div className="Admin">
        {/* NAVBAR */}
        <div
          className="navbar"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home {...props} />} />
          <Route path="/contact" element={<Contact {...props} />} />
          <Route path="/about" element={<About {...props} />} />
        </Routes>

        {/* INSERT PAGE */}
        <AdminInsert />
      </div>
    </BrowserRouter>
  );
}
