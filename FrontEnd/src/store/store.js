import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import expensesReducer from "./expensesSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expensesReducer,  
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
