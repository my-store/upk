import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import { openAlert } from '../../libs/redux/reducers/components/alert';
import { getUserData, removeLoginCredentials } from '../../libs/credentials';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, type CSSProperties } from 'react';
import { JSONPost } from '../../libs/requests';
import {
  finishWaitLogin,
  updateBg,
  waitLogin,
} from '../../libs/redux/reducers/login.slice';
import './styles/login.styles.main.scss';
import $ from 'jquery';

interface LoginProps {
  serverUrl: string;
  Callback?: any;
}

export default function Login(props: LoginProps) {
  const loginState = useSelector((state: RootState) => state.login);
  const { loginWait } = loginState;

  const dispatch = useDispatch();
  const errorSound = new Audio(`${props.serverUrl}/static/sounds/error.mp3`);

  // Background image, remove loading only when background is loaded
  const bgUrl: string = `${props.serverUrl}/static/img/company-team.jpeg`;

  useEffect(() => {
    // Always clean localstorage before action
    removeLoginCredentials();

    // Wait background image is fully loaded,
    // then remove loading.
    const bg = new Image();
    bg.onload = () => {
      // Update background URL state
      dispatch(updateBg(bgUrl));

      // Remove loading animation after 3 second
      setTimeout(() => dispatch(rootRemoveLoading()), 3000);
    };
    bg.src = bgUrl;
  }, []);

  function failed(msg: string): void {
    // Play error sound
    errorSound.play();

    // Show alert box
    dispatch(
      openAlert({
        type: 'Error',
        title: 'Gagal Masuk',
        body: msg,
      }),
    );

    // Close from login-wait state
    dispatch(finishWaitLogin());
  }

  async function prepareLogin() {
    // Block if already wating for login
    if (loginWait) return;

    // Set login wait
    dispatch(waitLogin());

    const tlp: any = $('.login #tlp').val();
    const pass: any = $('.login #pass').val();

    // No data is presented
    if (tlp.length < 1 || pass.length < 1) {
      // Terminate task
      return failed('Mohon isi seluruh data');
    }

    // Persiapan login
    try {
      const tryLogin = await JSONPost('/api/auth', {
        body: JSON.stringify({ tlp, pass }),
      });
      // ---------------------------------------------------------------------------
      // JIKA DATA LOGIN BENAR
      // ---------------------------------------------------------------------------
      // Maka response yang diberikan server yaitu:
      // access_token dan role
      // access_token yang akan digunakan pada headers.Authorization
      // role = Admin, Kasir atau User, ini server yang menentukan saat proses login
      // server akan mencari tahu siapa yang sedang login.

      // Tlp atau password salah
      if (tryLogin?.statusCode == 401) {
        // Terminate task
        return failed('Kombinasi data tidak benar');
      }

      // Server tidak memberikan response yang diharapkan seperti dijelaskan diatas
      // kemungkinan ada error pada server atau konfigurasi.
      if (!tryLogin.access_token || !tryLogin.role) {
        // Terminate task and display the error message
        return failed('Tidak ada akses token dari server');
      }

      /*
      | -------------------------------------------------------
      | LOGIN CREDENTIALS
      | -------------------------------------------------------
      | access_token, role and data
      */

      // Get login profile
      const userData = await getUserData(tlp, tryLogin);

      // No user data is founded
      if (!userData) {
        // Terminate task and display the error message
        return failed('Data user tidak ditemukan');
      }

      // Create login credentials on local storage
      const loginData = { ...tryLogin, data: userData };
      localStorage.setItem('UPK.Login.Credentials', JSON.stringify(loginData));

      // Trigger callback (if exist)
      if (props.Callback) {
        props.Callback();
      }
    } catch (error) {
      // Terminate task
      return failed(`${error}`);
    }
  }

  const DynamicStyles: CSSProperties = {
    backgroundImage: `url(${loginState.loginBg})`,
  };

  return (
    <div className="login" style={DynamicStyles}>
      <div className="login-box-container">
        <div className="login-box">
          <div className="login-form-container">
            <div className="login-form-header">
              <p className="login-form-title">Masuk Dulu</p>
            </div>
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="login-form-group">
                <label>No. Tlp</label>
                <input type="text" id="tlp" />
              </div>
              <div className="login-form-group">
                <label>Password</label>
                <input type="password" id="pass" />
              </div>
              {/* Form buttons */}
              <div className="login-form-buttons">
                <button
                  className="login-form-button-submit"
                  onClick={prepareLogin}
                >
                  Masuk
                </button>
              </div>

              {/* Forgot password */}
              <p className="forgot-password-text">
                Lupa password?{' '}
                <span className="forgot-password-link">Ubah</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
