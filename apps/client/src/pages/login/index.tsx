import { connect } from '../../libs/redux/reducers/socket.slice';
import { login } from '../../libs/redux/reducers/login.slice';
import { useDispatch } from 'react-redux';
import { socket } from '../../libs/socket';
import '../../styles/login/index.scss';
import $ from 'jquery';

interface LoginProps {
  ServerUrl?: string;
}

export default function Login(props: LoginProps) {
  const dispatch = useDispatch();

  async function prepareLogin() {
    const username: any = $('.login #username').val();
    const password: any = $('.login #password').val();

    if (username.length < 1 || password.length < 1) {
      return alert('Mohon isi seluruh data!');
    }

    // Persiapan login
    const tryLogin = await fetch(`${props.ServerUrl}/api/admin`);
    let loginData = null;

    // If wrong credentials, the server will return null or undefined not json type
    try {
      loginData = await tryLogin.json();
    } catch (error) {
      // Wrong credentials | Login failed
      return alert('Kombinasi data salah!');
    }

    // Hubungkan socket
    socket.on('connect', () => {
      // Ubah state socket ke status "conected"
      dispatch(connect());

      // Tutup login form

      // Buka halaman beranda / Default
      dispatch(login(loginData));
    });
  }

  const DynamicStyles = {
    backgroundImage: `url(${props?.ServerUrl}/static/img/company-team.jpeg)`,
  };

  return (
    <div className="login" style={DynamicStyles}>
      <div className="login-box">
        <div className="login-form-container">
          <div className="login-form-header">
            <p className="login-form-title">Masuk Dulu</p>
          </div>
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="login-form-group">
              <label>Username</label>
              <input type="text" id="username" />
            </div>
            <div className="login-form-group">
              <label>Password</label>
              <input type="password" id="password" />
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
              Lupa password? <span className="forgot-password-link">Ubah</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
