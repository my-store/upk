import { createSlice } from '@reduxjs/toolkit';
import type { ActionInterface } from '../store';

interface DefaultPersediaanStateInterface {
  daftar: any[];
}

export const DefaultPersediaanState: DefaultPersediaanStateInterface = {
  daftar: [
    { nama: 'Izzat Alharis', address: 'Brebes' },
    { nama: 'Reza Kejot', address: 'Subang' },
    { nama: 'Aris Tianto', address: 'Subang' },
  ],
};

function AddToDaftar(
  state: DefaultPersediaanStateInterface,
  action: ActionInterface,
) {
  state.daftar.push(action.payload);
}

function RemoveFromDaftar(
  state: DefaultPersediaanStateInterface,
  action: ActionInterface,
) {
  const index = state.daftar.indexOf(action.payload);
  state.daftar.splice(index, 1);
}

const PersediaanSlice = createSlice({
  name: 'persediaan',
  initialState: DefaultPersediaanState,
  reducers: {
    persediaanAddToDaftar: AddToDaftar,
    persediaanRemoveFromDaftar: RemoveFromDaftar,
  },
});

export const { persediaanAddToDaftar, persediaanRemoveFromDaftar } =
  PersediaanSlice.actions;
export default PersediaanSlice.reducer;
