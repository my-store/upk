import { disconnect } from './libs/redux/reducers/socket.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, type JSX } from 'react';
import type { RootState } from './libs/redux/store';
import Persediaan from './pages/persediaan';
import Sidebar from './templates/Sidebar';
import Footer from './templates/Footer';
import Header from './templates/Header';
import { socket } from './libs/socket';
import Laporan from './pages/laporan';
import Login from './pages/login';
import './App.scss';
import SocketDisconnected from './templates/SocketDisconnected';

// Server configuration (this must be matched with api/.env file)
const ServerUrl: string = 'http://192.168.1.102:5000';

const AvailabelPage = [
  {
    id: 'persediaan',
    component: <Persediaan />,
  },
  {
    id: 'laporan',
    component: <Laporan />,
  },
];

interface SignedInPageProps {
  setPage: Function;
  page: JSX.Element;
}

function SignedInPage(props: SignedInPageProps) {
  // Socket state
  const connected = useSelector((state: RootState) => state.socket.connected);

  return (
    <div className="App">
      <Header />
      <Sidebar setPage={props.setPage} />
      <main>
        <div className="banner"></div>
        {props.page}

        {/* Disconnect message | Will override everithing */}
        {!connected && <SocketDisconnected />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Login state
  const loginState = useSelector((state: RootState) => state.login);

  // State dispatcher
  const dispatch = useDispatch();

  const [page, updatePage]: any = useState(null);

  // This function only for signed-in users
  function setPage(id: string) {
    const newPage = AvailabelPage.find((ap) => ap.id == id);
    if (newPage) {
      updatePage(
        <SignedInPage
          setPage={setPage}
          page={{
            ...newPage.component,
            props: {
              ...newPage.component.props,
              ServerUrl,
            },
          }}
        />,
      );
    }
  }

  useEffect(() => {
    // Login check ...

    // Load default page
    // if (loginState.isLogin && loginState.loginData) {
    //   setPage('laporan');
    // }

    // Load login page
    // else {
    //   updatePage(<Login ServerUrl={ServerUrl} />);
    // }

    // Default page in development | Pending ...
    setPage('laporan');

    // Pending ...
    // Socket connection listener

    // Socket terputus
    socket.on('disconnect', () => {
      // Ubah state socket ke status "disconected"
      dispatch(disconnect());
    });
  }, []);

  return page;
}

export default App;
