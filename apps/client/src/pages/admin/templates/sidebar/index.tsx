import { adminSidebarSetAdminData } from '../../../../libs/redux/reducers/admin/admin.sidebar.slice';
import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import type { AdminGlobalStyleInterface } from '../..';
import { serverUrl, socket } from '../../../../App';
import './styles/admin.sidebar.styles.main.scss';
import { useNavigate } from 'react-router-dom';
import {
  removeLoginCredentials,
  getLoginCredentials,
} from '../../../../libs/credentials';
import { useEffect } from 'react';

interface AdminSidebarProps {
  globalStyle: AdminGlobalStyleInterface;
}

export default function AdminSidebar(props: AdminSidebarProps) {
  const { globalStyle } = props;

  const sidebarState = useSelector((state: RootState) => state.admin_sidebar);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Colors
  const { primaryColor } = globalStyle;

  function load() {
    const { data } = getLoginCredentials();
    dispatch(adminSidebarSetAdminData(data));
  }

  function prepareLogout() {
    // Clean credentials (on local-storage)
    removeLoginCredentials();

    // Display loading animation
    dispatch(rootOpenLoading());

    // Open login page
    dispatch(logout());

    // Disconnect from socket server
    socket.disconnect();
  }

  useEffect(() => {
    load();
  }, []);

  // Terminate if admin-login-data is null
  if (!sidebarState.adminData) return null;

  return (
    <div className="Admin-Sidebar">
      <div className="Admin-Sidebar-Profile-Container">
        <div className="Admin-Sidebar-Profile-Photo-Container">
          <div
            className="Admin-Sidebar-Profile-Photo-Image"
            style={{
              backgroundImage: `url(${serverUrl + '/static' + sidebarState.adminData.foto})`,
            }}
          ></div>
        </div>
        <div className="Admin-Sidebar-Profile-Info-Container">
          <p className="Admin-Sidebar-Profile-Info-Name">
            {sidebarState.adminData.nama}
          </p>
          <p className="Admin-Sidebar-Profile-Info-Email">
            {sidebarState.adminData.tlp}
          </p>
        </div>
      </div>

      <div className="Admin-Sidebar-Button-Container">
        {/* Homepage */}
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/admin')}
        >
          Beranda
        </button>

        {/* Admin */}
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/admin/admin')}
        >
          Admin
        </button>

        {/* User */}
        <button
          style={{ color: primaryColor }}
          onClick={() => navigate('/admin/user')}
        >
          User
        </button>

        {/* Sample Buttons */}
        <button style={{ color: primaryColor }}>Inventaris</button>
        <button style={{ color: primaryColor }}>Bank Ops BKK</button>
        <button style={{ color: primaryColor }}>Bank Jateng</button>
        <button style={{ color: primaryColor }}>Modal</button>
        <button style={{ color: primaryColor }}>Operasional</button>
        <button style={{ color: primaryColor }}>Laba Rugi</button>
        <button style={{ color: primaryColor }}>Micro Finance</button>

        {/* Logout */}
        <button
          style={{ color: primaryColor }}
          onClick={(e) => {
            e.preventDefault();
            prepareLogout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
