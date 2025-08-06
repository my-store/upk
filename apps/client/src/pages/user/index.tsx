// import { disconnect } from '../../libs/redux/reducers/socket.slice';
import { BrowserRouter, Route, Routes } from 'react-router';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './templates/sidebar';
import Footer from './templates/footer';
import Header from './templates/header';
import Inventaris from './inventaris';
import '../../styles/user/index.scss';
// import { io } from 'socket.io-client';
import { useEffect } from 'react';
import Laporan from './laporan';

interface UserProps {
  ServerUrl: string;
}

const GlobalStyle = {
  navbarHeight: 35,
  sidebarWidth: 220,
  primaryColor: 'rgb(50, 101, 167)',
  secondaryColor: 'rgb(33, 76, 131)',
};

export default function User(props: UserProps) {
  const { ServerUrl } = props;

  const { connected } = useSelector((state: RootState) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(localStorage.getItem('UPK.Login.Credentials'));
    // const socket = io(ServerUrl);

    // socket.on('connect', () => {
    //   console.log('Connected!');
    // });

    // socket.on('disconnect', () => {
    //   console.log('Disconnected!');
    //   dispatch(disconnect());
    // });
  }, []);

  return null;

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
        <Sidebar globalStyle={GlobalStyle} />
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
