import type { ActionInterface } from '../store';
import { createSlice } from '@reduxjs/toolkit';

interface LoginDataInterface {
  nama: string;
  tlp: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

interface DefaultStateInterface {
  loginWait: boolean;
  loginBg: string;
  loginData: LoginDataInterface | boolean;
}

const DefaultState: DefaultStateInterface = {
  loginData: false,
  loginWait: false,
  loginBg: '',
};

function SetLoginData(state: DefaultStateInterface, action: ActionInterface) {
  state.loginData = action.payload;
}

function ResetLoginData(state: DefaultStateInterface) {
  state.loginData = DefaultState.loginData;
}

function WaitLogin(state: DefaultStateInterface) {
  state.loginWait = true;
}

function FinishWaitLogin(state: DefaultStateInterface) {
  state.loginWait = false;
}

function UpdateBg(state: DefaultStateInterface, action: ActionInterface) {
  state.loginBg = action.payload;
}

const LoginSlice = createSlice({
  name: 'login',
  initialState: DefaultState,
  reducers: {
    waitLogin: WaitLogin,
    finishWaitLogin: FinishWaitLogin,
    updateBg: UpdateBg,
    setLoginData: SetLoginData,
    resetLoginData: ResetLoginData,
  },
});

export const {
  waitLogin,
  finishWaitLogin,
  updateBg,
  setLoginData,
  resetLoginData,
} = LoginSlice.actions;
export default LoginSlice.reducer;
