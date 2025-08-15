import { JSONPost } from '../../../libs/requests';
// import { useDispatch } from 'react-redux';
import { useState } from 'react';

export default function AdminInsert() {
  // const dispatch = useDispatch();

  const [state, setState]: any = useState({
    nama: '',
    tlp: '',
    password: '',
    foto: '',
  });

  async function insert() {
    const data = new FormData();
    data.append('', '');

    // Insert data
    const req = await JSONPost('/api/admin', {
      headers: {
        // Authorization: `Bearer ${loginState.loginData?.access_token}`,
      },
      body: data,
    });

    // Token expired
    if (req.message && req.statusCode == 401) {
      // await RefreshToken(loginState.loginData?.data.tlp);

      // Recall this function
      return insert();
    }

    console.log(req);
  }

  function validate() {}

  function listenChange() {}

  return (
    <div className="Admin-Insert">
      <div className="Admin-Insert-Box">
        <form onSubmit={(e) => e.preventDefault()} method="POST">
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              name="nama"
              defaultValue={state.nama}
              onChange={(e) => setState({ ...state, nama: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Tlp</label>
            <input
              type="text"
              name="tlp"
              defaultValue={state.tlp}
              onChange={(e) => setState({ ...state, tlp: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Katasandi</label>
            <input
              type="text"
              name="password"
              defaultValue={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Foto</label>
            <input
              type="file"
              name="foto"
              onChange={(e: any) => {
                if (!e.target.files || e.target.files.length < 1) {
                  return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                  setState({ ...state, foto: evt.target?.result });
                };
                reader.readAsDataURL(e.target.files[0]);
              }}
            />
          </div>
          <div className="form-group">
            <div
              className="Image-Preview"
              style={{
                height: 300,
                width: 300,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url(${state.foto})`,
              }}
            ></div>
          </div>
          <div className="form-group">
            <button type="button" onClick={insert}>
              Simpan
            </button>
            <button type="button">Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
