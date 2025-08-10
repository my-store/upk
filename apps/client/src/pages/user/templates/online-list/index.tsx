import './styles/user.templates.online-list.styles.main.scss';

export default function OnlineList() {
  return (
    <div className="Online-List">
      <div className="Online-List-Header">
        <p className="Online-List-Header-Text">Pengguna</p>
      </div>
      <div className="Online-List-Body">
        <div className="Online-List-Item">
          <div className="Online-List-Item-Image"></div>
          <div className="Online-List-Item-Info">
            <p className="Online-List-Item-Name">Izzat Alharis</p>
          </div>
        </div>
      </div>
      <div className="Online-List-Footer"></div>
    </div>
  );
}
