import { createSlice } from '@reduxjs/toolkit';

interface DefaulState {
  isLoading: boolean;
}

const DefaultRootState: DefaulState = {
  isLoading: true,
};

function OpenLoading(state: DefaulState) {
  state.isLoading = true;
}

function RemoveLoading(state: DefaulState) {
  state.isLoading = false;
}

const RootSlice = createSlice({
  name: 'root',
  initialState: DefaultRootState,
  reducers: {
    rootOpenLoading: OpenLoading,
    rootRemoveLoading: RemoveLoading,
  },
});

export const { rootOpenLoading, rootRemoveLoading } = RootSlice.actions;
export default RootSlice.reducer;
