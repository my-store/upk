import { configureStore } from '@reduxjs/toolkit';
import PersediaanReducer from './reducers/persediaan.slice';
import SocketReducer from './reducers/socket.slice';
import LoginReducer from './reducers/login.slice';

export interface ActionInterface {
  payload: any;
  type: string;
}

export const store = configureStore({
  reducer: {
    persediaan: PersediaanReducer,
    socket: SocketReducer,
    login: LoginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
