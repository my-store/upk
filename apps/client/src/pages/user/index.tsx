import { UserOnlineList, UserOnlineListTrigger } from './templates/online-list';
import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './templates/sidebar';
import Footer from './templates/footer';
import Header from './templates/header';
import Inventaris from './inventaris';
import { useEffect } from 'react';
import './user.styles.main.scss';
import Laporan from './laporan';
import $ from 'jquery';

export interface UserGlobalStyleInterface {
  navbarHeight: number;
  sidebarWidth: number;
  primaryColor: string;
  secondaryColor: string;
}

const globalStyle: UserGlobalStyleInterface = {
  navbarHeight: 35,
  sidebarWidth: 220,
  primaryColor: 'rgb(50, 101, 167)',
  secondaryColor: 'rgb(33, 76, 131)',
};

function UserHome() {
  useEffect(() => {
    // Force scrolll to top
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }, []);

  return <h1>Homepage for User</h1>;
}

function UserGlobalTemplates({ children, socketConnect }: any) {
  const rootState = useSelector((state: RootState) => state.root);
  const onlineState = useSelector((state: RootState) => state.user_onlineList);
  const dispatch = useDispatch();

  function socketListener() {}

  // When the page is loaded or refreshed
  async function load() {
    socketListener();

    // After 3 seconds remove loading animation
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    // Connect to socket server, before any tasks
    socketConnect(load);
  }, []);

  // Invisible if still loading
  if (rootState.isLoading) return null;

  return (
    <div
      className="User"
      style={{
        paddingTop: globalStyle.navbarHeight,
        paddingLeft: globalStyle.sidebarWidth,
      }}
    >
      <Header globalStyle={globalStyle} />
      <Sidebar globalStyle={globalStyle} />
      {onlineState.opened && <UserOnlineList globalStyle={globalStyle} />}
      <UserOnlineListTrigger />
      {children}
      <Footer globalStyle={globalStyle} />
    </div>
  );
}

const UserRoutes = [
  {
    path: '/user',
    element: (props: any) => {
      return (
        <UserGlobalTemplates socketConnect={props.socketConnect}>
          <UserHome />
        </UserGlobalTemplates>
      );
    },
  },
  {
    path: '/user/inventaris',
    element: (props: any) => (
      <UserGlobalTemplates socketConnect={props.socketConnect}>
        <Inventaris />
      </UserGlobalTemplates>
    ),
  },
  {
    path: '/user/laporan',
    element: (props: any) => (
      <UserGlobalTemplates socketConnect={props.socketConnect}>
        <Laporan />
      </UserGlobalTemplates>
    ),
  },
];

export default UserRoutes;
