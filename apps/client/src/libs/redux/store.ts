import AlertReducer from './reducers/components/alert';
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
    alert: AlertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
