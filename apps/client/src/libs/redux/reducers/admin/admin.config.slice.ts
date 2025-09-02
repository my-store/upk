import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface UserListConfigInterface {
  shortByNew: boolean;
  maxDisplay: number;
  maxLoadMore: number;
  maxSearchDisplay: number;
}

interface UserInsertConfigInterface {
  autoActivate: boolean;
}

export interface UserConfigInterface {
  list: UserListConfigInterface;
  insert: UserInsertConfigInterface;
}

interface DefaultAdminConfigInterface {
  opened: boolean;
  user: UserConfigInterface;
}

export const DefaultAdminConfigState: DefaultAdminConfigInterface = {
  opened: false,
  user: {
    list: {
      shortByNew: true,
      maxDisplay: 50,
      maxLoadMore: 15,
      maxSearchDisplay: 50,
    },
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

function SetUserListShortByNewHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.shortByNew = action.payload;
}

function SetUserListMaxDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxDisplay = action.payload;
}

function SetUserListMaxLoadMoreHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxLoadMore = action.payload;
}

function SetUserListMaxSearchDisplayHandler(
  state: DefaultAdminConfigInterface,
  action: ActionInterface,
) {
  state.user.list.maxSearchDisplay = action.payload;
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
    setUserListMaxDisplay: SetUserListMaxDisplayHandler,
    setUserListMaxLoadMore: SetUserListMaxLoadMoreHandler,
    setUserListMaxSearchDisplay: SetUserListMaxSearchDisplayHandler,
    setUserListShortByNew: SetUserListShortByNewHandler,
  },
});

export const {
  setAdminConfigOpened,
  adminConfigSetUserInsertAutoActivate,
  setUserListMaxDisplay,
  setUserListMaxLoadMore,
  setUserListMaxSearchDisplay,
  setUserListShortByNew,
} = AdminConfigSlice.actions;
export default AdminConfigSlice.reducer;
