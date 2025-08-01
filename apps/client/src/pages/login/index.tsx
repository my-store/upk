import { openAlert } from '../../libs/redux/reducers/components/alert';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { type CSSProperties } from 'react';
import '../../styles/login/index.scss';
import $ from 'jquery';
import {
  finishWaitLogin,
  waitLogin,
} from '../../libs/redux/reducers/login.slice';

interface LoginProps {
  ServerUrl: string;
}

export default function Login(props: LoginProps) {
  const loginState = useSelector((state: RootState) => state.login);
  const { loginWait } = loginState;

  const dispatch = useDispatch();
  const errorSound = new Audio(`${props.ServerUrl}/static/sounds/error.mp3`);

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

    let token: any = null;
    let profile: any = null;

    // If wrong credentials, the server will return null or undefined not json type
    try {
      // Persiapan login
      const tryLogin = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tlp, pass }),
      });

      // Tlp atau password salah
      if (tryLogin.status == 401) {
        // Terminate task
        return failed('Kombinasi data tidak benar');
      }

      const { access_token } = await tryLogin.json();

      // JWT access token
      if (!access_token) {
        // Terminate task
        return failed('Tidak ada akses token dari server');
      }

      // Get jwt profile
      const tryProfile = await fetch('/api/auth', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      // Berisi { sub, data }
      const tryProfileResult = await tryProfile.json();

      token = access_token;
      profile = tryProfileResult;
    } catch (error) {
      // Terminate task
      return failed(JSON.stringify(error));
    }

    // Login succeed, create credentials on local machine
    createCredentials(token, profile);

    // Reload page
    window.location.reload();
  }

  function createCredentials(Token: string, Data: any) {
    localStorage.setItem(
      'UPK.Login.Credentials',
      JSON.stringify({ Token, Data }),
    );
  }

  const DynamicStyles: CSSProperties = {
    backgroundImage: `url(${props.ServerUrl}/static/img/company-team.jpeg)`,
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
