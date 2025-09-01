import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { removeLoginCredentials } from '../../../../libs/credentials';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import './styles/admin.templates.navbar.styles.main.scss';
import { useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../../../../App';
import { setAdminConfigOpened } from '../../../../libs/redux/reducers/admin/admin.config.slice';

interface AdminNavbarProps {
  globalStyle: any;
}

export default function AdminNavbar(props: AdminNavbarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { globalStyle } = props;

  // Colors
  const { primaryColor, secondaryColor } = globalStyle;

  const globalButtonStyle: CSSProperties = {
    backgroundColor: secondaryColor,
  };

  return (
    <nav
      className="Admin-Navbar"
      style={{
        backgroundColor: primaryColor,
      }}
    >
      <p className="Admin-Navbar-Title">Permata Komputer</p>
      <header className="Admin-Navbar-Link-Container">
        <button
          style={globalButtonStyle}
          className="Admin-Navbar-Link-Item"
          onClick={() => navigate('/admin')}
        >
          Home
        </button>
        <button
          style={globalButtonStyle}
          className="Admin-Navbar-Link-Item"
          onClick={() => navigate('/admin/insert')}
        >
          Insert
        </button>
        <button
          style={globalButtonStyle}
          className="Admin-Navbar-Link-Item"
          onClick={() => dispatch(setAdminConfigOpened(true))}
        >
          Pengaturan
        </button>
        <button
          style={globalButtonStyle}
          className="Admin-Navbar-Link-Item"
          onClick={() => {
            // Clean credentials (on local-storage)
            removeLoginCredentials();

            // Display loading animation
            dispatch(rootOpenLoading());

            // Set login=false and force to open login page
            dispatch(logout());

            // Disconnect from socket server
            socket.disconnect();
          }}
        >
          Logout
        </button>
      </header>
    </nav>
  );
}
