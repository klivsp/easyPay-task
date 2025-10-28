import { configureStore } from "@reduxjs/toolkit";
import { currencyApi } from "./services/api";

export const store = configureStore({
  reducer: {
    [currencyApi.reducerPath]: currencyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(currencyApi.middleware),
});
