import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useLocation } from 'react-router-dom';
import { fetchDailyTransactions } from "../store/expensesSlice";
import { useDispatch } from "react-redux";

const TransactionTable = () => {
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filter, setFilter] = useState("all");
    const [dailyTransactions, setDailyTransactions] = useState(null);
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const location = useLocation();
    const dispatch = useDispatch();
    const userId = localStorage.getItem('uid');
    
    const [selectedDate, setSelectedDate] = useState(() => {

        if(localStorage.getItem('selectedDate')) {
            return localStorage.getItem('selectedDate');
        }
        if (location?.state?.date) {
            return location.state.date;
        }

        const currentDate = new Date();
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    });


    useEffect(() => {
        const fetchData = async () => {
            const [year, month] = selectedDate.split('-');
            const currentMonth = parseInt(month);
            const currentYear = parseInt(year);
            setIsTransactionsLoading(true);
            setError(null);
            try {
                const dailyResponse = await dispatch(
                    fetchDailyTransactions({ userId, currentMonth, currentYear })
                ).unwrap();
                
                setDailyTransactions(dailyResponse.monthlyMessages);
            } catch (error) {
                setError('Failed to fetch daily transactions. Please try again later.');
            } finally {
                setIsTransactionsLoading(false);
            }
        };

        fetchData();
    }, [dispatch, userId, selectedDate]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        localStorage.setItem('selectedDate', event.target.value);
    };

    // Memoized filtered and sorted transactions
    const filteredAndSortedTransactions = useMemo(() => {
        if (!dailyTransactions) return [];

        const sortedTransactions = [...dailyTransactions].sort((a, b) => {
            let comparison = 0;
            if (sortField === "amount") {
                comparison = parseFloat(a.amount.replace(/,/g, '')) - parseFloat(b.amount.replace(/,/g, ''));
            } else {
                comparison = a[sortField].localeCompare(b[sortField]);
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return sortedTransactions.filter(
            (transaction) => filter === "all" || transaction.type === filter
        );
    }, [dailyTransactions, sortField, sortDirection, filter]);

    // Helper functions remain the same
    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const date = new Date(`${year}-${month}-${day}T${timePart}`);

        // if (isNaN(date.getTime())) {
        //     console.error(`Invalid date: ${dateString}`);
        //     return "Invalid Date";
        // }

        return `${day}/${month}/${year}`;
    };

    const formatAmount = (amount) => {
        const parsedAmount = parseFloat(amount.replace(/,/g, ''));
        if (isNaN(parsedAmount)) {
            return "Invalid Amount";
        }
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(parsedAmount);
    };

    const generateDateOptions = () => {
        const options = [];
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        for (let year = currentYear; year >= currentYear - 2; year--) {
            for (let month = 11; month >= 0; month--) {
                if (year === currentYear && month > currentMonth) continue;
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}`;
                const dateLabel = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
                options.push(
                    <option key={dateString} value={dateString}>
                        {dateLabel}
                    </option>
                );
            }
        }

        return options;
    };

    return (
            <div className="w-full p-6 bg-gray-900 shadow-xl">
            {/* Header section - Always visible */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">Daily Transactions</h2>
                    <select
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 min-w-[200px]"
                    >
                        {generateDateOptions()}
                    </select>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {["all", "CREDIT", "Debited"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-md ${
                                filter === type
                                    ? (type === "CREDIT" 
                                        ? "bg-green-600" 
                                        : type === "Debited" 
                                            ? "bg-red-600" 
                                            : "bg-blue-600")
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions section - Conditionally rendered */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            {["date", "amount", "type"].map(field => (
                                <th
                                    key={field}
                                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700"
                                    onClick={() => handleSort(field)}
                                >
                                    <div className="flex items-center gap-1">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                        {sortField === field ? (
                                            sortDirection === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            )
                                        ) : (
                                            <ArrowUpDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isTransactionsLoading ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-3 text-center text-gray-400">
                                    Loading transactions...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-3 text-center text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredAndSortedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-4 py-3 text-center text-gray-400">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedTransactions.map((transaction, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td
                                        className={`px-4 py-3 font-medium ${
                                            transaction.type === "CREDIT"
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {formatAmount(transaction.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                transaction.type === "CREDIT"
                                                    ? "bg-green-900 text-green-300"
                                                    : "bg-red-900 text-red-300"
                                            }`}
                                        >
                                            {transaction.type}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!isTransactionsLoading && !error && (
                <div className="mt-4 text-gray-400 text-sm">
                    Showing {filteredAndSortedTransactions.length} transactions
                </div>
            )}
        </div>
    );
};

export default TransactionTable;
