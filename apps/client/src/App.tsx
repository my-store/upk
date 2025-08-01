import { rootRemoveLoading } from './libs/redux/reducers/root.slice';
import { BrowserRouter, Route, Routes } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { FirstLoading } from './components/loading';
import type { RootState } from './libs/redux/store';
import Alert from './components/alert';
import Login from './pages/login';
import { useEffect } from 'react';
import './App.scss';
import { login } from './libs/redux/reducers/login.slice';

// Server configuration (this must be matched with api/.env file)
const ServerUrl: string = 'http://localhost:5000';

function Admin() {
  return <h1>Admin Page</h1>;
}

function User() {
  return <h1>User Page</h1>;
}

function NotFound() {
  return <h1>404 | Not Found</h1>;
}

function App() {
  const state = useSelector((state: RootState) => state.root);
  const loginState = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();

  async function checkToken(Token: string): Promise<Response> {
    const checkToken = await fetch('/api/auth', {
      headers: {
        Authorization: `Bearer ${Token}`,
        'Content-Type': 'application/json',
      },
    });
    return checkToken;
  }

  async function signedIn(props: { Token: string; Data: string }) {
    const { Token, Data }: any = props;

    // Cek token
    const tokenChecked = await checkToken(Token);
    // Token is expired
    if (tokenChecked.status == 401) {
      // Refresh token
      const tryRefresh = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: Data.data }),
      });
      const refreshedToken = await tryRefresh.json();

      // Cek kembali token hasil refresh
      let recheckedToken: any = await checkToken(refreshedToken.access_token);

      // Failed to refresh token, maybe user deleteed or something
      if (recheckedToken.status == 401) {
        // Remove credentials from local storage
        localStorage.removeItem('UPK.Login.Credentials');

        // Terminate task and reload the page
        return window.location.reload();
      }

      // Refreshsed token is valid, berisi { sub, data }
      recheckedToken = await recheckedToken.json();

      // Re-save (new) credentials
      localStorage.setItem(
        'UPK.Login.Credentials',
        JSON.stringify({
          Token: refreshedToken.access_token,
          Data: recheckedToken,
        }),
      );

      // Set login
      dispatch(login(recheckedToken.data));
    }

    // Remove loading animation
    dispatch(rootRemoveLoading());
  }

  useEffect(() => {
    // Find login data on local-storage
    const loginCredentials = localStorage.getItem('UPK.Login.Credentials');

    // Login data not exist
    if (!loginCredentials) {
      // Remove loading animation
      dispatch(rootRemoveLoading());
    }

    // Login data is founded
    else {
      signedIn(JSON.parse(loginCredentials));
    }
  }, []);

  if (state.isLoading) {
    return <FirstLoading ServerUrl={ServerUrl} easing="ease-in-out" />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Alert />
        <Routes>
          <Route path="*" element={<NotFound />} />

          {!loginState.isLogin && (
            <Route path="/" element={<Login ServerUrl={ServerUrl} />} />
          )}

          {loginState.isLogin && <Route path="/" element={<Admin />} />}
          {/* {loginState.isLogin && <Route path="/user" element={<User />} />} */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

// const [page, setPage] = useState(null as any);

// async function checkToken(Token: string): Promise<Response> {
//   const checkToken = await fetch('/api/auth', {
//     headers: {
//       Authorization: `Bearer ${Token}`,
//       'Content-Type': 'application/json',
//     },
//   });
//   return checkToken;
// }

// async function signedIn(props: { Token: string; Data: string }) {
//   const { Token, Data }: any = props;

//   return console.log({ Token, Data });

//   // Cek token
//   const tokenChecked = await checkToken(Token);
//   // Token is expired
//   if (tokenChecked.status == 401) {
//     // Refresh token
//     const tryRefresh = await fetch('/api/auth/refresh', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ data: Data.data }),
//     });
//     const refreshedToken = await tryRefresh.json();

//     // Cek kembali token hasil refresh
//     let recheckedToken = await checkToken(refreshedToken.access_token);

//     // Failed to refresh token, maybe user deleteed or something
//     if (recheckedToken.status == 401) {
//       // Remove credentials from local storage
//       localStorage.removeItem('UPK.Login.Credentials');

//       // Terminate task and reload the page
//       return window.location.reload();
//     }

//     // Refreshsed token is valid, berisi { sub, data }
//     recheckedToken = await recheckedToken.json();

//     // Re-save (new) credentials
//     localStorage.setItem(
//       'UPK.Login.Credentials',
//       JSON.stringify({
//         Token: refreshedToken.access_token,
//         Data: recheckedToken,
//       }),
//     );
//   }

//   setPage(userPage);
// }
