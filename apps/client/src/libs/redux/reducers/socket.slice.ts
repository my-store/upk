import { createSlice } from '@reduxjs/toolkit';

interface DefaultSocketStateInterface {
  connected: boolean;
}

export const DefaultSocketState: DefaultSocketStateInterface = {
  connected: false,
};

function ConnectHandle(state: DefaultSocketStateInterface) {
  state.connected = true;
}

function DisconnectHandle(state: DefaultSocketStateInterface) {
  state.connected = false;
}

const SocketSlice = createSlice({
  name: 'persediaan',
  initialState: DefaultSocketState,
  reducers: {
    connect: ConnectHandle,
    disconnect: DisconnectHandle,
  },
});

export const { connect, disconnect } = SocketSlice.actions;
export default SocketSlice.reducer;
