import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("accessToken") || null,
    userId: localStorage.getItem("uid"),
};

export const login = createAsyncThunk(
    "auth/login",
    async ({ idToken }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                
                idToken,
            });

            const { accessToken, uid } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("uid", uid);

            return { accessToken, uid };
        } catch (error) {
            console.log("Login error", error);
            toast.error(error.response?.data?.message || "Login failed!");
            return rejectWithValue(
                error.response?.data?.message || "Login failed!"
            );
        }
    }
);

export const getUser = createAsyncThunk(
    "auth/getUser",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/${userId}`);
            return response.data;
        } catch (error) {
            console.log("Get user error", error);
            return rejectWithValue(
                error.response?.data?.message || "Get user failed!"
            );
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
                state.userId = action.payload.uid;
                toast.success("Login successful!");
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
