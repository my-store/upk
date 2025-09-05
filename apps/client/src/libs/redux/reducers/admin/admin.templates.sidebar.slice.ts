import type { ActionInterface } from '../../store';
import { createSlice } from '@reduxjs/toolkit';

interface DefaultStateInterface {
  opened: boolean;
  boxOpened: boolean;
}

const DefaultState: DefaultStateInterface = {
  opened: false,
  boxOpened: false,
};

function OpenHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.opened = action.payload;
}

function BoxOpenHandler(state: DefaultStateInterface, action: ActionInterface) {
  state.boxOpened = action.payload;
}

const AdminTemplateSidebarSlice = createSlice({
  name: 'admin.templates.sidebar',
  initialState: DefaultState,
  reducers: {
    adminTemplatesSidebarOpen: OpenHandler,
    adminTemplatesSidebarBoxOpen: BoxOpenHandler,
  },
});

export const { adminTemplatesSidebarOpen, adminTemplatesSidebarBoxOpen } =
  AdminTemplateSidebarSlice.actions;
export default AdminTemplateSidebarSlice.reducer;
