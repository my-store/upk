import {
  adminUserListSetListData,
  adminUserSetActivateWait,
  adminUserSetUpdatedData,
} from '../../../libs/redux/reducers/admin/admin.user.list.slice';
import { setAdminConfigOpened } from '../../../libs/redux/reducers/admin/admin.config.slice';
import { openAlert } from '../../../libs/redux/reducers/components.alert.slice';
import { getLoginCredentials, refreshToken } from '../../../libs/credentials';
import { JSONGet, JSONPatch } from '../../../libs/requests';
import type { RootState } from '../../../libs/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './styles/admin.user.styles.main.scss';
import { serverUrl } from '../../../App';
import { useEffect } from 'react';

export default function AdminUserList() {
  const config = useSelector((state: RootState) => state.admin_config.user);
  const state = useSelector((state: RootState) => state.admin_user_list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function load() {
    const { access_token, data } = getLoginCredentials();
    const { maxDisplay } = config.list;

    let url: string = `/api/user/?take=${maxDisplay}`;

    if (config.list.shortByNew) {
      url += `&orderBy={"id": "desc"}`;
    }

    /* ------------ STATUS ------------
    | 1 = Tampilkan semua
    | 2 = Tampilkan yang aktif saja
    | 3 = Tampilkan yang nonaktif saja
    */
    const { display } = config.list;
    // Tidak menampilkan semua
    if (display != 1) {
      // Ketika display=2, maka tampilkan active=true, dan sebaliknya.
      url += `&where={"active": ${display != 3}}`;
    }

    // Kirim request ke server (GET)
    const req = await JSONGet(url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Error occured
    if (req.message) {
      // Some server error response, 401 is Unauthorized
      if (req.statusCode != 401) {
        // Terminate task and display error message
        return dispatch(
          openAlert({
            type: 'Error',
            title: 'Gagal mengambil data',
            body: req.message,
          }),
        );
      }

      // Token expired | Unauthorized | Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    // Set data state
    dispatch(adminUserListSetListData(req));
  }

  // Block or activate user (toggle true & false)
  async function activate(id: number, active: boolean) {
    // Activation is waiting
    if (state.activateWait) {
      // Terminate task
      return;
    }

    // Set activation wait state
    dispatch(adminUserSetActivateWait(true));

    // Mengambil login credentials pada local-storage
    const { access_token, data } = getLoginCredentials();

    const url: string = `/api/user/${id}`;

    // Kirim request ke server (PATCH)
    const req = await JSONPatch(url, {
      headers: { Authorization: `Bearer ${access_token}` },
      body: JSON.stringify({ active }),
    });

    // Error occured
    if (req.message) {
      // Some server error response, 401 is Unauthorized
      if (req.statusCode != 401) {
        // Reset activation wait state
        dispatch(adminUserSetActivateWait(false));

        // Terminate task and display error message
        return dispatch(
          openAlert({
            type: 'Error',
            title: 'Gagal merubah data',
            body: req.message,
          }),
        );
      }

      // Token expired | Unauthorized | Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return activate(id, active);
    }

    // Update data (single, only this data)
    dispatch(adminUserSetUpdatedData(req));

    // Reset activation wait state
    dispatch(adminUserSetActivateWait(false));
  }

  useEffect(
    () => {
      load();
    },
    // Ketika ada perubahan state dibawah ini, fungsi diatas akan dipanggil kembali
    [
      // Jenis data yang ditampilkan (semua, aktif dan non-aktif)
      config.list.display,

      // Maksimal jumlah untuk menampilkan data
      config.list.maxDisplay,

      // Urutkan data berdasarkan terbaru atau terlama
      config.list.shortByNew,
    ],
  );

  return (
    <div className="User-List">
      <div className="User-List-Header">
        <p className="User-List-Header-Text">Daftar User</p>
        <div className="User-List-Header-Button-Container">
          <button onClick={() => navigate('/admin/user/insert')}>Input</button>
          <p className="Admin-Navbar-Link-Sepataror">.</p>
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
              <button
                onClick={() => activate(d.id, d.active ? false : true)}
                className="User-List-Item-Info-Active-Button"
                style={{
                  backgroundColor: d.active ? '#c7255bff' : '#25c789ff',
                }}
              >
                {d.active ? 'Blokir' : 'Aktivasi'}
              </button>
            </div>
          </div>
        ))}

        {/* Still Empty */}
        {state.data.length < 1 && <p className="User-List-Empty">Kosong</p>}
      </div>
    </div>
  );
}
