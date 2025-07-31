interface SidebarProps {
  setPage: Function;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="profile">
        <div className="profile-photo-container">
          <div className="profile-photo-image"></div>
        </div>
        <div className="profile-info">
          <p className="profile-name">Izzat Alharis</p>
          <p className="profile-email">izzatalharist@gmail.com</p>
        </div>
      </div>
      <div className="sidebar-buttons">
        <button>Kasir</button>
        <button>User</button>
        <button onClick={() => props.setPage('persediaan')}>Persediaan</button>
        <button>Modal</button>
        <button>Inventaris</button>
        <button>Bank 1</button>
        <button>Bank 2</button>
        <button>Bank 3</button>
        <button>Bank 4</button>
        <button>Bank 5</button>
        <button>Bank 6</button>
        <button>Bank 7</button>
        <button>Bank 8</button>
        <button>Bank 9</button>
        <button>Bank 10</button>
        <button>Neraca</button>
        <button onClick={() => props.setPage('laporan')}>Laporan</button>
      </div>
    </div>
  );
}
