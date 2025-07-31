import { createSlice } from '@reduxjs/toolkit';
import type { ActionInterface } from '../store';

// Mengikuti data dari server
export interface LoginDataInterface {
  id: string | number;
  nama: string;
  tlp: string;
  foto: string;
}

interface DefaultLoginStateInterface {
  isLogin: boolean;
  loginData: LoginDataInterface | boolean;
}

export const DefaultLoginState: DefaultLoginStateInterface = {
  isLogin: false,
  loginData: false,
};

function LoginHandler(
  state: DefaultLoginStateInterface,
  action: ActionInterface,
) {
  state.isLogin = true;
  state.loginData = action.payload;
}

function LogoutHandler(state: DefaultLoginStateInterface) {
  state.isLogin = false;
  state.loginData = false;
}

const LoginSlice = createSlice({
  name: 'login',
  initialState: DefaultLoginState,
  reducers: {
    login: LoginHandler,
    logout: LogoutHandler,
  },
});

export const { login, logout } = LoginSlice.actions;
export default LoginSlice.reducer;
