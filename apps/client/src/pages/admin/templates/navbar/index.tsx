// import { setAdminConfigOpened } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import './styles/admin.templates.navbar.styles.main.scss';
// import type { CSSProperties } from 'react';
// import { useDispatch } from 'react-redux';

interface AdminNavbarProps {
  globalStyle: any;
}

export default function AdminNavbar(props: AdminNavbarProps) {
  // const dispatch = useDispatch();

  const { globalStyle } = props;

  // Colors
  const { primaryColor } = globalStyle;

  return (
    <nav
      className="Admin-Navbar"
      style={{
        backgroundColor: primaryColor,
      }}
    >
      <p className="Admin-Navbar-Title">Permata Komputer</p>
      <header className="Admin-Navbar-Link-Container">
        {/* <button
          style={globalButtonStyle}
          className="Admin-Navbar-Link-Item"
          onClick={() => dispatch(setAdminConfigOpened(true))}
        >
          Pengaturan
        </button> */}
        <button>Dokumentasi</button>
        <p className="Admin-Navbar-Link-Sepataror">.</p>
        <button>Kontak</button>
        <p className="Admin-Navbar-Link-Sepataror">.</p>
        <button>Tentang Kami</button>
      </header>
    </nav>
  );
}
