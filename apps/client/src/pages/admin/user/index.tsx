import { adminUserListSetListData } from '../../../libs/redux/reducers/admin/admin.user.list.slice';
import { getLoginCredentials, refreshToken } from '../../../libs/credentials';
import type { RootState } from '../../../libs/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { JSONGet } from '../../../libs/requests';
import './styles/admin.user.styles.main.scss';
import { useEffect } from 'react';
import { setAdminConfigOpened } from '../../../libs/redux/reducers/admin/admin.config.slice';
import { serverUrl } from '../../../App';

export default function AdminUserList() {
  const config = useSelector((state: RootState) => state.admin_config.user);
  const state = useSelector((state: RootState) => state.admin_user_list);
  const dispatch = useDispatch();

  async function load() {
    const { access_token, data } = getLoginCredentials();
    const { maxDisplay } = config.list;

    let url: string = `/api/user/?take=${maxDisplay}`;

    if (config.list.shortByNew) {
      url += `&orderBy={"id": "desc"}`;
    }

    const req = await JSONGet(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Token expired
    if (req.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    dispatch(adminUserListSetListData(req));
  }

  useEffect(() => {
    load();
  }, [config.list.maxDisplay, config.list.shortByNew]);

  return (
    <div className="User-List">
      <div className="User-List-Header">
        <p className="User-List-Header-Text">Daftar User</p>
        <div className="User-List-Header-Button-Container">
          <button onClick={() => dispatch(setAdminConfigOpened(true))}>
            Pengaturan
          </button>
        </div>
      </div>

      <div className="User-List-Body">
        {state.data.map((d, dx) => (
          <div key={d.id + dx.toString()} className="User-List-Item-Container">
            <div className="User-List-Item-Image-Container">
              <div
                style={{
                  backgroundImage: `url(${serverUrl + '/static' + d.foto})`,
                }}
                className="User-List-Item-Image"
              ></div>
            </div>
            <div className="User-List-Item-Info-Container">
              <p className="User-List-Item-Info-Nama">{d.nama}</p>
              <p className="User-List-Item-Info-Tlp">{d.tlp}</p>
            </div>
          </div>
        ))}

        {/* Still Empty */}
        {state.data.length < 1 && <p className="User-List-Empty">Kosong</p>}
      </div>
    </div>
  );
}
