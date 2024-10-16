import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("accessToken") || null,
};

export const login = createAsyncThunk(
    "auth/login",
    async ({idToken}, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                idToken,
            });

            const { accessToken } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("uid", response.data.uid);

            return { accessToken };
        } catch (error) {
            console.log("Login error", error);
            toast.error(error.response?.data?.message || "Login failed!");
            return rejectWithValue(error.response?.data?.message || "Login failed!");
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                toast.success("Login successful!");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
