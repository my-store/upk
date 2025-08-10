import './styles/user.templates.sidebar.styles.main.scss';
import { Link } from 'react-router';

interface SidebarProps {
  globalStyle: any;
  userData: any;
  serverUrl: string;
}

export default function Sidebar(props: SidebarProps) {
  const { globalStyle, userData, serverUrl } = props;

  // Colors
  const { primaryColor } = globalStyle;

  // Navbar config
  const { navbarHeight } = globalStyle;

  // Sidebar config
  const { sidebarWidth } = globalStyle;

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
              backgroundImage: `url(${serverUrl + '/static' + userData.foto})`,
            }}
          ></div>
        </div>
        <div className="profile-info">
          <p className="profile-name">{userData.nama}</p>
          <p className="profile-email">{userData.tlp}</p>
        </div>
      </div>
      <div className="sidebar-buttons-container">
        <Link className="sidebar-button" style={{ color: primaryColor }} to="/">
          Beranda
        </Link>
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/inventaris"
        >
          Inventaris
        </Link>
        <Link
          className="sidebar-button"
          style={{ color: primaryColor }}
          to="/laporan"
        >
          Laporan
        </Link>
      </div>
    </div>
  );
}
