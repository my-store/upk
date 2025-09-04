import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultStateInterface {
  data: any[];
  activateWait: boolean;
}

const DefaultState: DefaultStateInterface = {
  data: [],
  activateWait: false,
};

function SetActivateWaitHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.activateWait = action.payload;
}

function SetUpdatedDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  // Find, make sure the item is inside data (matched)
  const matched = state.data.find((nd: any) => nd.id == action.payload.id);
  // If so
  if (matched) {
    // Get the index of matched item
    const matchedIndex = state.data.indexOf(matched);
    // Replace matched data with new data
    state.data[matchedIndex] = action.payload;
  }
}

function SetListDataHandler(
  state: DefaultStateInterface,
  action: ActionInterface,
) {
  state.data = action.payload;
}

const AdminUserListSlice = createSlice({
  name: 'admin.user.list',
  initialState: DefaultState,
  reducers: {
    adminUserListSetListData: SetListDataHandler,
    adminUserSetActivateWait: SetActivateWaitHandler,
    adminUserSetUpdatedData: SetUpdatedDataHandler,
  },
});

export const {
  adminUserListSetListData,
  adminUserSetActivateWait,
  adminUserSetUpdatedData,
} = AdminUserListSlice.actions;
export default AdminUserListSlice.reducer;
