import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useLocation } from 'react-router-dom';
import { getYearlyMessages } from "../store/expensesSlice";
import { useDispatch } from "react-redux";

const Yearly = () => {
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filter, setFilter] = useState("all");
    const [dailyTransactions, setDailyTransactions] = useState(null);

    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (location?.state?.dailyDebitAndCredit) {
            setDailyTransactions(location.state.dailyDebitAndCredit);
        }
    }, [location.state]);

    const userId = localStorage.getItem('uid');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        if (!dailyTransactions) {
            const fetchTransactions = async () => {
                try {
                    const dailyResponse = await dispatch(getYearlyMessages({ userId, currentYear })).unwrap();
                    setDailyTransactions(dailyResponse);
                } catch (error) {
                    console.error('Failed to fetch daily transactions:', error);
                }
            };
            fetchTransactions();
        }
    }, [dailyTransactions, userId, currentYear, dispatch]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const filteredAndSortedTransactions = useMemo(() => {
        if (!dailyTransactions) return [];

        const sortedTransactions = [...dailyTransactions].sort((a, b) => {
            let comparison = 0;
            if (sortField === "amount") {
                comparison = parseFloat(a.amount) - parseFloat(b.amount);
            } else {
                comparison = a[sortField].localeCompare(b[sortField]);
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return sortedTransactions.filter(
            (transaction) => filter === "all" || transaction.type === filter
        );
    }, [dailyTransactions, sortField, sortDirection, filter]);

    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const date = new Date(`${year}-${month}-${day}T${timePart}`);

        if (isNaN(date.getTime())) {
            console.error(`Invalid date: ${dateString}`);
            return "Invalid Date";
        }

        return `${day}/${month}/${year}`;
    };

    const formatAmount = (amount) => {
        // Ensure the amount is a valid number
        if (typeof amount !== 'string') {
            // Convert to string if it's a number
            amount = amount.toString();
        }

        const parsedAmount = parseFloat(amount.replace(/,/g, ''));
        if (isNaN(parsedAmount)) {
            return "Invalid Amount";
        }
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(parsedAmount);
    };

    return (
        <div className="w-full p-6 bg-gray-900 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Yearly Transactions</h2>
                <div className="flex gap-2">
                    {["all", "credited", "debited"].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-md ${filter === type
                                ? (type === "credited" ? "bg-green-600" : "bg-red-600")
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

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
                        {filteredAndSortedTransactions.map((transaction, index) => {
                            return (
                                <tr key={index} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-4 py-3">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className={`px-4 py-3 font-medium ${transaction.type === "credited" ? "text-green-400" : "text-red-400"}`}>
                                        {formatAmount(transaction.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === "credited" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-gray-400 text-sm">
                Showing {filteredAndSortedTransactions.length} transactions
            </div>
        </div>
    );
};

export default Yearly;
