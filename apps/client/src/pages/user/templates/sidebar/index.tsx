import { userSidebarSetUserData } from '../../../../libs/redux/reducers/user.sidebar.slice';
import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import type { RootState } from '../../../../libs/redux/store';
import './styles/user.templates.sidebar.styles.main.scss';
import { useDispatch, useSelector } from 'react-redux';
import type { UserGlobalStyleInterface } from '../..';
import { serverUrl, socket } from '../../../../App';
import {
  getLoginCredentials,
  removeLoginCredentials,
} from '../../../../libs/credentials';
import { Link } from 'react-router';
import { useEffect } from 'react';

interface SidebarProps {
  globalStyle: UserGlobalStyleInterface;
}

export default function Sidebar(props: SidebarProps) {
  const { globalStyle } = props;

  const sidebarState = useSelector((state: RootState) => state.user_sidebar);
  const dispatch = useDispatch();

  // Colors
  const { primaryColor } = globalStyle;

  // Navbar config
  const { navbarHeight } = globalStyle;

  // Sidebar config
  const { sidebarWidth } = globalStyle;

  function load() {
    const { data } = getLoginCredentials();
    dispatch(userSidebarSetUserData(data));
  }

  function prepareLogout() {
    // Don't forget to emit offline first before delete local storage
    const { data, role } = getLoginCredentials();
    socket.emit('offline', { tlp: data.tlp, role });

    // Clean credentials (on local-storage)
    removeLoginCredentials();

    // Display loading animation
    dispatch(rootOpenLoading());

    // Open login page
    dispatch(logout());
  }

  useEffect(() => {
    load();
  }, []);

  // Terminate if user-login-data is null
  if (!sidebarState.userData) return null;

  return (
    <div
      className="Sidebar"
      style={{
        paddingTop: `${navbarHeight}px`,
        width: `${sidebarWidth}px`,
      }}
    >
      <div className="profile">
        <div
          className="profile-photo-container"
          style={{
            width: `${sidebarWidth}px`,
            height: `${sidebarWidth}px`,
          }}
        >
          <div
            className="profile-photo-image"
            style={{
              width: `${sidebarWidth - 15}px`,
              height: `${sidebarWidth - 15}px`,
              backgroundImage: `url(${serverUrl + '/static' + sidebarState.userData.foto})`,
            }}
          ></div>
        </div>
        <div className="profile-info">
          <p className="profile-name">{sidebarState.userData.nama}</p>
          <p className="profile-email">{sidebarState.userData.tlp}</p>
        </div>
      </div>
      <div className="sidebar-buttons-container">
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/user"
        >
          Beranda
        </Link>
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/user/inventaris"
        >
          Inventaris
        </Link>
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/user/laporan"
        >
          Laporan
        </Link>
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/user"
          onClick={(event) => {
            event.preventDefault();
            prepareLogout();
          }}
        >
          Keluar
        </Link>
      </div>
    </div>
  );
}
