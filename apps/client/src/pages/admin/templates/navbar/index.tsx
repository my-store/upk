import { rootOpenLoading } from '../../../../libs/redux/reducers/root.slice';
import { logout } from '../../../../libs/redux/reducers/login.slice';
import './styles/admin.navbar.styles.main.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { socket } from '../../../../App';
import {
  removeLoginCredentials,
  getLoginCredentials,
} from '../../../../libs/credentials';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <nav className="Admin-Navbar">
      <p className="Admin-Navbar-Title">Permata Komputer</p>
      <div className="Admin-Navbar-Link-Container">
        <button
          className="Admin-Navbar-Link-Item"
          onClick={() => navigate('/admin')}
        >
          Home
        </button>
        <button
          className="Admin-Navbar-Link-Item"
          onClick={() => navigate('/admin/contact')}
        >
          Contact
        </button>
        <button
          className="Admin-Navbar-Link-Item"
          onClick={() => navigate('/admin/about')}
        >
          About
        </button>
        <button
          className="Admin-Navbar-Link-Item"
          onClick={() => {
            // Don't forget to emit offline first before delete local storage
            const { data, role } = getLoginCredentials();
            socket.emit('offline', { tlp: data.tlp, role });

            // Clean credentials (on local-storage)
            removeLoginCredentials();

            // Display loading animation
            dispatch(rootOpenLoading());

            // Set login=false and force to open login page
            dispatch(logout());
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
