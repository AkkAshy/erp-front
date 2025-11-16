import { createSlice } from "@reduxjs/toolkit";

interface AppSettingsState {
  paymentMethods: {
    id: number;
    method: string;
    status: boolean;
    selected: boolean;
    label: string;
  }[];
}

const initialState: AppSettingsState = {
  paymentMethods: localStorage.getItem("paymentMethods")
    ? JSON.parse(localStorage.getItem("paymentMethods") as string)
    : [
        {
          id: 1,
          selected: false,
          status: true,
          method: "card",
          label: "Terminal",
        },
        {
          id: 2,
          selected: false,
          status: true,
          method: "transfer",
          label: "O’tkazma",
        },
        {
          id: 3,
          selected: true,
          status: true,
          method: "cash",
          label: "Naqd pul",
        },
        {
          id: 4,
          selected: false,
          status: true,
          method: "hybrid",
          label: "Gibrid",
        },
      ],
};

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
      localStorage.setItem("paymentMethods", JSON.stringify(action.payload));
    },
  },
});

export const { setPaymentMethods } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;

//: PayloadAction<string>
