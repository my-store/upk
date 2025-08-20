import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultUserInsertInterface {
  nama: string;
  tlp: string;
  password: string;
  foto: string;

  insertWait: boolean;
}

const DefaultUserInsertState: DefaultUserInsertInterface = {
  nama: '',
  tlp: '',
  password: '',
  foto: '',

  insertWait: false,
};

function SetNamaHandler(
  state: DefaultUserInsertInterface,
  action: ActionInterface,
) {
  state.nama = action.payload;
}

function SetTlpHandler(
  state: DefaultUserInsertInterface,
  action: ActionInterface,
) {
  state.tlp = action.payload;
}

function SetPasswordHandler(
  state: DefaultUserInsertInterface,
  action: ActionInterface,
) {
  state.password = action.payload;
}

function SetFotoHandler(
  state: DefaultUserInsertInterface,
  action: ActionInterface,
) {
  state.foto = action.payload;
}

function SetWaitHandler(
  state: DefaultUserInsertInterface,
  action: ActionInterface,
) {
  state.insertWait = action.payload;
}

const UserInsertSlice = createSlice({
  name: 'admin.user.insert',
  initialState: DefaultUserInsertState,
  reducers: {
    userInsertSetNama: SetNamaHandler,
    userInsertSetTlp: SetTlpHandler,
    userInsertSetPassword: SetPasswordHandler,
    userInsertSetFoto: SetFotoHandler,
    userInsertSetWait: SetWaitHandler,
  },
});

export const {
  userInsertSetNama,
  userInsertSetTlp,
  userInsertSetPassword,
  userInsertSetFoto,
  userInsertSetWait,
} = UserInsertSlice.actions;
export default UserInsertSlice.reducer;
