import { createSlice } from '@reduxjs/toolkit';
import type { ActionInterface } from '../store';

// Mengikuti data dari server
export interface LoginDataInterface {
  id: string | number;
  nama: string;
  tlp: string;
  foto: string;
}

interface DefaultLoginInterface {
  isLogin: boolean;
  loginWait: boolean;
  loginBg: string;
  loginData: LoginDataInterface | boolean;
}

const DefaultLoginState: DefaultLoginInterface = {
  isLogin: false,
  loginWait: false,
  loginBg: '',
  loginData: false,
};

function LoginHandler(state: DefaultLoginInterface, action: ActionInterface) {
  state.isLogin = true;
  state.loginData = action.payload;
}

function LogoutHandler(state: DefaultLoginInterface) {
  state.isLogin = false;
  state.loginData = false;
}

function WaitLoginHandler(state: DefaultLoginInterface) {
  state.loginWait = true;
}

function FinishWaitLoginHandler(state: DefaultLoginInterface) {
  state.loginWait = false;
}

function UpdateBgHandler(
  state: DefaultLoginInterface,
  action: ActionInterface,
) {
  state.loginBg = action.payload;
}

const LoginSlice = createSlice({
  name: 'login',
  initialState: DefaultLoginState,
  reducers: {
    waitLogin: WaitLoginHandler,
    finishWaitLogin: FinishWaitLoginHandler,
    updateBg: UpdateBgHandler,
    login: LoginHandler,
    logout: LogoutHandler,
  },
});

export const { waitLogin, finishWaitLogin, updateBg, login, logout } =
  LoginSlice.actions;
export default LoginSlice.reducer;
