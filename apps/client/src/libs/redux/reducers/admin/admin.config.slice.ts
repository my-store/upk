import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface UserInsertConfigInterface {
  autoActivate: boolean;
}

export interface UserConfigInterface {
  insert: UserInsertConfigInterface;
}

interface DefaultAdminConfigInterface {
  opened: boolean;
  user: UserConfigInterface;
}

const DefaultAdminConfigState: DefaultAdminConfigInterface = {
  opened: false,
  user: {
    insert: {
      autoActivate: true,
    },
  },
};

function SetAdminConfigOpenedHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.opened = action.payload;
}

function SetUserInsertAutoActivate(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.insert.autoActivate = action.payload;
}

const AdminConfigSlice = createSlice({
  name: 'admin.config',
  initialState: DefaultAdminConfigState,
  reducers: {
    setAdminConfigOpened: SetAdminConfigOpenedHandler,
    adminConfigSetUserInsertAutoActivate: SetUserInsertAutoActivate,
  },
});

export const { setAdminConfigOpened, adminConfigSetUserInsertAutoActivate } =
  AdminConfigSlice.actions;
export default AdminConfigSlice.reducer;
