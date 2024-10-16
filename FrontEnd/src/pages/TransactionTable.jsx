import React, { useState } from "react";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useLocation } from 'react-router-dom';


const TransactionTable = () => {
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filter, setFilter] = useState("all");

    const location = useLocation();
    const dailyTransactions = location?.state?.dailyDebitAndCredit;
    console.log(dailyTransactions)


    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedTransactions = [...dailyTransactions].sort((a, b) => {
        let comparison = 0;
        if (sortField === "amount") {
            comparison = parseFloat(a.amount) - parseFloat(b.amount);
        } else {
            comparison = a[sortField].localeCompare(b[sortField]);
        }
        return sortDirection === "asc" ? comparison : -comparison;
    });

    const filteredTransactions = sortedTransactions.filter(
        (transaction) => filter === "all" || transaction.type === filter
    );

    const formatDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const date = new Date(`${year}-${month}-${day}T${timePart}`);

        if (isNaN(date.getTime())) {
            console.error(`Invalid date: ${dateString}`);
            return "Invalid Date";
        }

        return `${month}/${day}/${year}`;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(parseFloat(amount));
    };

    return (
        <div className="w-full p-6 bg-gray-900 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Daily Transactions
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-md ${filter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter("Credited")}
                        className={`px-4 py-2 rounded-md ${filter === "Credited"
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Credited
                    </button>
                    <button
                        onClick={() => setFilter("Debited")}
                        className={`px-4 py-2 rounded-md ${filter === "Debited"
                                ? "bg-red-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Debited
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700"
                                onClick={() => handleSort("date")}
                            >
                                <div className="flex items-center gap-1">
                                    Date
                                    {sortField === "date" ? (
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
                            <th
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700"
                                onClick={() => handleSort("amount")}
                            >
                                <div className="flex items-center gap-1">
                                    Amount
                                    {sortField === "amount" ? (
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
                            <th
                                className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700"
                                onClick={() => handleSort("type")}
                            >
                                <div className="flex items-center gap-1">
                                    Type
                                    {sortField === "type" ? (
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredTransactions.map((transaction, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-800 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    {formatDate(transaction.date)}
                                </td>
                                <td
                                    className={`px-4 py-3 font-medium ${transaction.type === "Credited"
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {formatAmount(transaction.amount)}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === "Credited"
                                                ? "bg-green-900 text-green-300"
                                                : "bg-red-900 text-red-300"
                                            }`}
                                    >
                                        {transaction.type}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-gray-400 text-sm">
                Showing {filteredTransactions.length} transactions
            </div>
        </div>
    );
};

export default TransactionTable;
