import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultAdminUserListStateInterface {
  data: any[];
}

const DefaultAdminUserListState: DefaultAdminUserListStateInterface = {
  data: [],
};

function SetListData(
  state: DefaultAdminUserListStateInterface,
  action: ActionInterface,
) {
  state.data = action.payload;
}

const AdminUserListSlice = createSlice({
  name: 'admin.user.list',
  initialState: DefaultAdminUserListState,
  reducers: {
    adminUserListSetListData: SetListData,
  },
});

export const { adminUserListSetListData } = AdminUserListSlice.actions;
export default AdminUserListSlice.reducer;
