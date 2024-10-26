import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchMonthlySummary = createAsyncThunk(
    "expenses/fetchMonthlySummary",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/expense/allMonthSummary/${userId}/2024`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch monthly summary"
            );
        }
    }
);

export const fetchTotalAmounts = createAsyncThunk(
    "expenses/fetchTotalAmounts",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/expense/${userId}/total`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch total amounts"
            );
        }
    }
);

export const fetchMonthlyDebitCredit = createAsyncThunk(
    "expenses/fetchMonthlyDebitCredit",
    async ({ userId, currentMonth, currentYear }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/expense/${userId}/monthlyDebitCredit/${currentMonth}/${currentYear}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch monthly debit/credit"
            );
        }
    }
);

export const fetchDailyTransactions = createAsyncThunk(
    "expenses/fetchDailyTransactions",
    async ({ userId, currentMonth, currentYear }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/expense/${userId}/monthly/messages/${currentMonth}/${currentYear}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch daily transactions"
            );
        }
    }
);

export const getYearlyMessages = createAsyncThunk(
    "expenses/getYearlyMessages",
    async ({ userId, currentYear }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/expense/${userId}/messages/${currentYear}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch yearly messages"
            );
        }
    }
);

const initialState = {
    monthlyData: null,
    totalAmounts: {
        totalDebit: 0,
        totalCredit: 0,
    },
    monthlyDebit: 0,
    monthlyCredit: 0,
    dailyDebit: [],
    dailyCredit: [],
    loading: false,
    error: null,
};

const expensesSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthlySummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyData = processMonthlyData(action.payload);
            })
            .addCase(fetchMonthlySummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchTotalAmounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTotalAmounts.fulfilled, (state, action) => {
                state.loading = false;
                state.totalAmounts.totalDebit = action.payload.totalDebit;
                state.totalAmounts.totalCredit = action.payload.totalCredit;
            })
            .addCase(fetchTotalAmounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMonthlyDebitCredit.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMonthlyDebitCredit.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlyDebit = action.payload.data.totalDebit;
                state.monthlyCredit = action.payload.data.totalCredit;
            })
            .addCase(fetchMonthlyDebitCredit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDailyTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDailyTransactions.fulfilled, (state, action) => {
                state.loading = false;
                const dailyTransactions = action.payload.monthlyMessages;
                state.dailyDebit = processTransactions(
                    dailyTransactions,
                    "Debited"
                );
                state.dailyCredit = processTransactions(
                    dailyTransactions,
                    "Credited"
                );
            })
            .addCase(fetchDailyTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getYearlyMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(getYearlyMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.yearlyMessages = action.payload.data;
            })
            .addCase(getYearlyMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default expensesSlice.reducer;

const processMonthlyData = (data) => {
    return data;
};

const processTransactions = (transactions, type) => {
    return transactions.filter((transaction) => transaction.type === type);
};
