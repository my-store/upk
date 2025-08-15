import UserOnlineListReducer from './reducers/user.online-list.slice';
import AlertReducer from './reducers/components.alert.slice';
import UserSidebarSlice from './reducers/user.sidebar.slice';
import SocketReducer from './reducers/socket.slice';
import { configureStore } from '@reduxjs/toolkit';
import LoginReducer from './reducers/login.slice';
import RootReducer from './reducers/root.slice';

export interface ActionInterface {
  payload: any;
  type: string;
}

export const store = configureStore({
  reducer: {
    root: RootReducer,
    socket: SocketReducer,
    login: LoginReducer,
    component_alert: AlertReducer,
    user_onlineList: UserOnlineListReducer,
    user_sidebar: UserSidebarSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
