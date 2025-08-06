import { openAlert } from './libs/redux/reducers/components/alert';
import { JSONGet, JSONPost } from './libs/redux/requests';
import { useDispatch, useSelector } from 'react-redux';
import { FirstLoading } from './components/loading';
import type { RootState } from './libs/redux/store';
import { useEffect, useState } from 'react';
import Alert from './components/alert';
import Login from './pages/login';
import Admin from './pages/admin';
import Kasir from './pages/kasir';
import User from './pages/user';
import './App.scss';

// Server configuration (this must be matched with api/.env file)
const ServerUrl: string = 'http://localhost:5000';

function App() {
  const [page, setPage] = useState(null as any);
  const state = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  function openLoginPage() {
    // Set login page as active page
    setPage(<Login ServerUrl={ServerUrl} Callback={checkCredentials} />);
  }

  async function checkProfile(access_token: string): Promise<any> {
    let profile: any;
    try {
      // Show progress message
      console.log('Checking token ...');

      // Melakukan pengecekan ke server apakah token masih aktif
      profile = await JSONGet('/api/auth', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      // Jika token expired, response dari server adalah:
      // message dan statusCode.
      // message = Unauthorized
      // statusCode = 401
      // ----------------------------------------------------
      // Namun jika token masih aktif, response server adalah:
      // iat, exp, sub, role
      // iat = Issued At (where the token is created)
      // exp = Expired
      // sub = No Tlp. User/Admin/Kasir
      // role = User/Admin/Kasir
      if (!profile.iat || !profile.exp || !profile.sub || !profile.role) {
        // Show error message
        console.error('Token is expired');

        // Terminate task
        return false;
      }
    } catch {
      // Show error message
      console.error('Failed to get login profile');

      // Terminate task
      return false;
    }
    return profile;
  }

  // Call this function if token is expired
  async function refreshToken(tlp: string) {
    try {
      // Show progress message
      console.log('Refreshing token ...');

      // Melakukan permintaan ke server untuk dibuatkan token baru
      const refreshedToken = await JSONPost('/api/auth/refresh', {
        body: JSON.stringify({ tlp }),
      });
      // Jika refresh token berhasil dibuat, maka response darai server
      // adalah sama dengan ketika login yaitu berisi:
      // access_token dan role
      // access_token yang akan digunakan pada headers.Authorization
      // role = Admin, Kasir atau User, ini server yang menentukan saat proses login
      // server akan mencari tahu siapa yang sedang login.

      // Permintaan token baru ditolak atau terjadi error pada server
      if (!refreshedToken.access_token || !refreshedToken.role) {
        // Show error message
        console.error('Failed to refresh token', refreshedToken);

        // Terminate process and force to open login page
        return openLoginPage();
      }

      // Update login profile
      const profile = await JSONGet('/api/auth', {
        headers: {},
      });
      localStorage.setItem('UPK.Login.Profile', JSON.stringify(profile));

      // Refresh token succeed, re-create credentials on local storage
      localStorage.setItem(
        'UPK.Login.Credentials',
        JSON.stringify({ ...refreshedToken, tlp }),
      );

      // Show progress message
      console.log('Token is refreshed');

      /*
          | Token sudah expired, namun berhasil mendapatkan token baru
          | Step selanjutnya adalah membuka halaman default sesuai role:
          | Admin | User | Kasir
          */
    } catch {
      // Failed to refresh token, show the error message
      dispatch(
        openAlert({
          type: 'Error',
          title: 'Gagal Memperbarui Token',
          body: 'Sepertinya ada masalah saat komputer mencoba meminta token baru kepada server.',
        }),
      );
      // Terminate process and force to open login page
      return openLoginPage();
    }
  }

  async function checkToken(data: string) {
    // Important token | login data
    const { access_token, role } = JSON.parse(data);

    // If important data is not valid
    if (!access_token || !role) {
      // Show error message
      console.error('Login credentials in not valid');

      // Force open login page
      return openLoginPage();
    }

    // Check login-profile
    const profile = await checkProfile(access_token);
    if (!profile) {
      // Token expired, force to open login page
      return openLoginPage();
    }

    // Show progress message
    console.log('Token check is passed');

    // Buka halaman sesuai tipe/role login
    if (role == 'Admin') {
      setPage(<Admin />);
    } else if (role == 'User') {
      setPage(<User ServerUrl={ServerUrl} />);
    } else if (role == 'Kasir') {
      setPage(<Kasir />);
    }
  }

  function checkCredentials() {
    // Find login data on local-storage
    const loginCredentials = localStorage.getItem('UPK.Login.Credentials');

    // User NOT signed-in
    if (!loginCredentials) {
      // Force open login page
      return openLoginPage();
    }

    // Already signed-in, execute token checker
    checkToken(loginCredentials);
  }

  useEffect(() => {
    checkCredentials();
  }, []);

  return (
    <div className="App">
      {state.isLoading && (
        <FirstLoading ServerUrl={ServerUrl} easing="ease-in-out" />
      )}
      <Alert />
      {page}
    </div>
  );
}

export default App;
