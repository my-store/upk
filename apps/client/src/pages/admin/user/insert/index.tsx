import { openAlert } from '../../../../libs/redux/reducers/components.alert.slice';
import {
  userInsertSetPassword,
  userInsertSetWait,
  userInsertSetFoto,
  userInsertSetNama,
  userInsertSetTlp,
} from '../../../../libs/redux/reducers/admin/user.insert.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { JSONPost } from '../../../../libs/requests';
import './styles/admin.user.insert.styles.main.scss';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../../../../App';
import {
  getLoginCredentials,
  refreshToken,
} from '../../../../libs/credentials';
import $ from 'jquery';

interface DefaultInsertConfigInterface {
  active: boolean;
}

const DefaultInsertConfig: DefaultInsertConfigInterface = {
  active: true,
};

export default function UserInsert() {
  const state = useSelector((state: RootState) => state.admin_user_insert);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorAudioURL: string = `${serverUrl}/static/sounds/error.mp3`;
  const errorSound: HTMLAudioElement = new Audio(errorAudioURL);

  function getInsertConfig() {
    //
  }

  function failed(msg: string): void {
    // Play error sound
    errorSound.play();

    // Show alert box
    dispatch(
      openAlert({
        type: 'Error',
        title: 'Gagal menambahkan user baru',
        body: msg,
      }),
    );

    // Close from insert-wait state
    dispatch(userInsertSetWait(false));
  }

  async function insert() {
    // Block multiple input request | Wait until finish!
    if (state.insertWait) return;

    // Force user to wait until insert logic is finished
    dispatch(userInsertSetWait(true));

    const { nama, tlp, password, foto } = state;

    if (nama.length < 1) return failed('Silahkan isi nama user');
    if (tlp.length < 1) return failed('Silahkan isi no tlp user');
    if (password.length < 1) return failed('Silahkan isi password user');
    if (foto.length < 1) return failed('Silahkan pilih foto user');

    const imageInput: any = $(
      '.Admin-User-Insert-Form-Image input[name="foto"]',
    )[0];

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('tlp', tlp);
    formData.append('password', password);
    formData.append('foto', imageInput.files[0]);

    // Get login data
    const { access_token, data } = getLoginCredentials();

    // Insert data
    const insertReq = await JSONPost('/api/user', {
      headers: { Authorization: `Bearer ${access_token}` },
      body: formData,
    });

    // Token expired
    if (insertReq.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Close from insert-wait state
      dispatch(userInsertSetWait(false));

      // Re-call this function
      return insert();
    }

    // Insert success

    // Show success message
    dispatch(
      openAlert({
        type: 'Success',
        title: 'User baru berhasil ditambahkan',
        body: `Nama: ${nama}\nTlp: ${tlp}`,
      }),
    );

    // Reset form
    resetForm();
  }

  function resetForm() {
    dispatch(userInsertSetNama(''));
    dispatch(userInsertSetTlp(''));
    dispatch(userInsertSetPassword(''));
    dispatch(userInsertSetFoto(''));

    // Close from insert-wait state
    dispatch(userInsertSetWait(false));
  }

  // function validate() {}

  // function listenChange() {}

  return (
    <div className="Admin-User-Insert">
      <div className="Admin-User-Insert-Box">
        <form onSubmit={(e) => e.preventDefault()} method="POST">
          <div className="Admin-User-Insert-Form-Group">
            <label>Nama</label>
            <input
              type="text"
              name="nama"
              defaultValue={state.nama}
              onChange={(e) => dispatch(userInsertSetNama(e.target.value))}
            />
          </div>

          <div className="Admin-User-Insert-Form-Group">
            <label>Tlp</label>
            <input
              type="text"
              name="tlp"
              defaultValue={state.tlp}
              onChange={(e) => dispatch(userInsertSetTlp(e.target.value))}
            />
          </div>

          <div className="Admin-User-Insert-Form-Group">
            <label>Katasandi</label>
            <input
              type="text"
              name="password"
              defaultValue={state.password}
              onChange={(e) => dispatch(userInsertSetPassword(e.target.value))}
            />
          </div>

          <div className="Admin-User-Insert-Form-Group">
            <label>Otomatis Aktivasi</label>
            <input
              type="checkbox"
              name="active"
              defaultChecked={state.active}
            />
          </div>

          <div className="Admin-User-Insert-Form-Image">
            <input
              type="file"
              name="foto"
              onChange={(e: any) => {
                if (!e.target.files || e.target.files.length < 1) {
                  return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                  dispatch(userInsertSetFoto(evt.target?.result));
                };
                reader.readAsDataURL(e.target.files[0]);
              }}
            />
            <div
              className="Admin-User-Insert-Form-Image-Preview"
              style={{
                backgroundImage:
                  state.foto.length > 0 ? `url(${state.foto})` : '',
              }}
              onClick={() => {
                const imageInput = $(
                  ".Admin-User-Insert-Form-Image input[name='foto']",
                )[0];
                imageInput.click();
              }}
            >
              {state.foto.length < 1 && (
                <p className="Admin-User-Insert-Form-Image-Label">
                  Tambah <br /> Foto
                </p>
              )}
            </div>
          </div>

          <div className="Admin-User-Insert-Form-Buttons">
            <button type="button" onClick={insert}>
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                // Reset form first
                resetForm();

                // Redirect to homepage
                navigate('/admin/user');
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
