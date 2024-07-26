import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  locationEnabled: boolean;
}

const initialState: LocationState = {
  locationEnabled: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.locationEnabled = action.payload;
    },
  },
});

export const { setLocationEnabled } = locationSlice.actions;
export default locationSlice.reducer;
