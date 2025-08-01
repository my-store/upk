import { createSlice } from '@reduxjs/toolkit';

interface DefaulStateInterface {
  isLoading: boolean;
}

const DefaultState: DefaulStateInterface = {
  isLoading: true,
};

function OpenLoadingHandler(state: DefaulStateInterface) {
  state.isLoading = true;
}

function RemoveLoadingHandler(state: DefaulStateInterface) {
  state.isLoading = false;
}

const RootSlice = createSlice({
  name: 'root',
  initialState: DefaultState,
  reducers: {
    rootOpenLoading: OpenLoadingHandler,
    rootRemoveLoading: RemoveLoadingHandler,
  },
});

export const { rootOpenLoading, rootRemoveLoading } = RootSlice.actions;
export default RootSlice.reducer;
