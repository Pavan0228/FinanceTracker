import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Bell, Clock, Clock10, CreditCard, FileSpreadsheet, PowerOffIcon, User, X } from 'lucide-react';
import axios from 'axios';
import { fetchDailyTransactions, fetchMonthlyDebitCredit, fetchMonthlySummary, fetchTotalAmounts } from '../store/expensesSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

// Custom Card components
const Card = ({ className, children }) => (
    <div className={`rounded-lg p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
    <h3 className="text-lg font-semibold mb-2">{children}</h3>
);

const CardContent = ({ children }) => (
    <div>{children}</div>
);

const CustomDailyTool = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const date = new Date(label);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const transaction = payload[0].payload;
        return (
            <div className="bg-gray-800 text-white p-2 rounded">
                <p>Date: {formattedDate}</p>
                <p>Amount: ₹{transaction.amount.toFixed(2)}</p>
                {transaction.source === 'input' && <p>Source: Input</p>}
            </div>
        );
    }
    return null;
};

const FinanceDashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [totalAmounts, setTotalAmounts] = useState({ totalDebit: 0, totalCredit: 0 });
    const [monthlyLimit, setMonthlyLimit] = useState('');
    const [monthlyDebit, setMonthlyDebit] = useState(0);
    const [monthlyCredit, setMonthlyCredit] = useState(0);
    const [dailyDebit, setDailyDebit] = useState([]);
    const [dailyCredit, setDailyCredit] = useState([]);
    const [showText, setShowText] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [dailyDebitAndCredit, setDailyDebitAndCredit] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => {
        const currentDate = new Date();
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    });
    const [CreditedTotal, setCreditedTotal] = useState(0);
    const [DebitedTotal, setDebitedTotal] = useState(0);
    const [showLimitInput, setShowLimitInput] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [newLimit, setNewLimit] = useState('');


    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

    const userId = localStorage.getItem('uid');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMonthlyLimit = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/monthly/user/${userId}/monthly-limit`);
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
                setMonthlyLimit(response.data.data[currentYear][currentMonth].limit);
            } catch (error) {
                console.error('Error fetching monthly limit:', error);
            }
        };

        fetchMonthlyLimit();
    }, [userId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userId) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const [year, month] = selectedDate.split('-');
                const currentMonth = parseInt(month);
                const currentYear = parseInt(year);

                const [monthlyResponse, totalResponse, monthlyDebitResponse, dailyResponse] = await Promise.all([
                    dispatch(fetchMonthlySummary(userId)).unwrap(),
                    dispatch(fetchTotalAmounts(userId)).unwrap(),
                    dispatch(fetchMonthlyDebitCredit({ userId, currentMonth, currentYear })).unwrap(),
                    dispatch(fetchDailyTransactions({ userId, currentMonth, currentYear })).unwrap(),
                ]);

                const processedData = processMonthlyData(monthlyResponse);
                setMonthlyData(processedData);
                setTotalAmounts({
                    totalDebit: totalResponse.totalDebit,
                    totalCredit: totalResponse.totalCredit
                });
                setMonthlyDebit(monthlyDebitResponse.data.totalDebit);
                setMonthlyCredit(monthlyDebitResponse.data.totalCredit);

                const dailyTransactions = dailyResponse.monthlyMessages;
                setDailyDebitAndCredit(dailyTransactions);

                const debitTransactions = processTransactions(dailyTransactions, "Debited");
                setDailyDebit(debitTransactions);

                const creditTransactions = processTransactions(dailyTransactions, "Credited");
                setDailyCredit(creditTransactions);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [dispatch, userId, selectedDate]);

    const handleLimitChange = async (newLimit) => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        try {
            const response = await axios.post(`${API_URL}/api/monthly/user/${userId}/monthly-limit`, {
                limit: newLimit,
                month: currentMonth,
                year: currentYear,
            });
            console.log('Monthly limit updated:', response.data.data.limit);
            setMonthlyLimit(response.data.data.limit);
            setShowLimitModal(false);
        } catch (error) {
            console.error('Error updating monthly limit:', error);
        }
    };

    const LimitModal = () => {
        const [localLimit, setLocalLimit] = useState(monthlyLimit.toString());
        const inputRef = useRef(null);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        const handleLocalLimitChange = (e) => {
            setLocalLimit(e.target.value);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            handleLimitChange(parseFloat(localLimit));
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Set Monthly Limit</h2>
                        <button onClick={() => setShowLimitModal(false)} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="number"
                            className="w-full p-2 bg-gray-700 text-white rounded mb-4"
                            placeholder="Enter new monthly limit"
                            value={localLimit}
                            onChange={handleLocalLimitChange}
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
                            >
                                Update Limit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };




    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const processTransactions = (transactions, type) => {
        const filteredTransactions = transactions
            .filter(transaction => transaction.type === type)
            .map(transaction => {
                const [datePart, timePart] = transaction.date.split(' ');
                const [day, month, year] = datePart.split('/');
                const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                return {
                    date: formattedDate,
                    amount: parseFloat(transaction.amount.replace(/,/g, '')),
                    source: transaction.source
                };
            });

        const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
            if (!acc[transaction.date]) {
                acc[transaction.date] = { amount: 0, source: transaction.source };
            }
            acc[transaction.date].amount += transaction.amount;
            return acc;
        }, {});

        return Object.entries(groupedTransactions)
            .map(([date, { amount, source }]) => ({ date, amount, source }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const processMonthlyData = (data) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames.map((name, index) => {
            const monthData = data.find(item => item.month === index + 1) || { totalCredit: 0, totalDebit: 0 };
            return {
                name,
                income: monthData.totalCredit,
                expenses: monthData.totalDebit
            };
        });
    };

    const getMonthlyDebitData = () => [
        { name: 'Spent', value: monthlyDebit },
        { name: 'Remaining', value: Math.max(monthlyLimit - monthlyDebit, 0) },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    }

    const handleClick = () => {
        navigate('/daily', { state: { date: selectedDate } });
    };

    useEffect(() => {
        let CreditedTotal = 0;
        let DebitedTotal = 0;
        dailyDebitAndCredit.forEach((message) => {
            if (message.type === "Credited") {
                CreditedTotal += parseFloat(message.amount.replace(/,/g, ''))
            } else if (message.type === "Debited") {
                DebitedTotal += parseFloat(parseFloat(message.amount.replace(/,/g, '')).toFixed(2));
            }
        });
        setCreditedTotal(CreditedTotal.toFixed(2))
        setDebitedTotal(DebitedTotal.toFixed(2))
    }, [dailyDebitAndCredit])


    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 lg:p-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between items-center justify-center lg:items-center gap-4 mb-6">
                {/* Logo */}
                <div className="flex items-center">
                    <h1 className="text-2xl lg:text-3xl font-bold">PennyWise</h1>
                </div>
    
                {/* Date and Limit Controls */}
                <div className="flex flex-row sm:flex-row items-start sm:items-center gap-3">
                    <select
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full sm:w-auto text-sm"
                    >
                        {generateDateOptions()}
                    </select>
                    <button
                        onClick={() => setShowLimitModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200 w-full sm:w-auto text-sm whitespace-nowrap"
                    >
                        Set Monthly Limit
                    </button>
                </div>
    
                {/* Utils */}
                <div className="flex  gap-4">
                    <div className="flex items-center gap-2">
                        <Clock10 className="w-5 h-5" />
                        <span className="text-sm text-gray-300">
                            {new Date().toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="relative">
                        <FileSpreadsheet
                            size={20}
                            className="cursor-pointer hover:text-green-400"
                            onMouseEnter={() => setShowText(true)}
                            onMouseLeave={() => setShowText(false)}
                        />
                        {showText && (
                            <div className="absolute right-0 mt-2 py-1 px-2 bg-gray-800 text-xs rounded shadow-lg z-10">
                                Download as Excel
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <PowerOffIcon 
                            className="hover:text-red-600 cursor-pointer" 
                            size={20}
                            onClick={handleLogout}
                            onMouseEnter={() => setShowLogout(true)}
                            onMouseLeave={() => setShowLogout(false)}
                        />
                    </div>
                </div>
            </div>
    
            {showLimitModal && <LimitModal />}
    
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary Cards Row */}
                <div className="bg-orange-500 rounded-xl p-6 lg:col-span-1 flex justify-evenly">
                    <div className="grid grid-cols-2   gap-2 gap-x-10  lg:gap-5">
                        <div>
                            <h1 className="xl:text-lg md:text-base text-lg md:whitespace-nowrap font-semibold ">Total Spendings</h1>
                            <p className="xl:text-3xl md:text-2xl text-xl font-bold">₹{totalAmounts.totalDebit.toLocaleString()}</p>
                        </div>
                        <div>
                            <h1 className="xl:text-lg md:text-base text-lg md:whitespace-nowrap font-semibold ">Total Earnings</h1>
                            <p className="xl:text-3xl md:text-2xl text-xl font-bold">₹{totalAmounts.totalCredit.toLocaleString()}</p>
                        </div>
                        <div>
                            <h2 className="xl:text-lg md:text-base text-lg md:whitespace-nowrap font-semibold  ">Monthly Earning</h2>
                            <p className="xl:text-3xl md:text-2xl text-xl font-bold">₹{CreditedTotal}</p>
                        </div>
                        <div>
                            <h2 className="xl:text-lg md:text-base text-lg md:whitespace-nowrap font-semibold ">Monthly Expense</h2>
                            <p className="xl:text-3xl md:text-2xl text-xl font-bold">₹{DebitedTotal}</p>
                        </div>
                    </div>
                </div>
    
                {/* Daily Transaction Charts */}
                <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-colors" onClick={handleClick}>
                    <h3 className="text-lg font-semibold mb-4">Daily Debit</h3>
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyDebit}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomDailyTool />} />
                                <Line type="monotone" dataKey="amount" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
    
                <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-colors" onClick={handleClick}>
                    <h3 className="text-lg font-semibold mb-4">Daily Credit</h3>
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyCredit}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomDailyTool />} />
                                <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
    
                {/* Yearly Overview Chart */}
                <div className="bg-gray-800 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Annual Income & Expenses</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="income" name="Income" stroke="#00C49F" strokeWidth={2} />
                                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
    
                {/* Monthly Spending Pie Chart */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={getMonthlyDebitData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {getMonthlyDebitData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2 text-center">
                        <p className="font-medium">Monthly Limit: ₹{monthlyLimit.toLocaleString()}</p>
                        <p className="font-medium">Spent: <span className="text-red-500">₹{monthlyDebit.toLocaleString()}</span></p>
                        <p className="font-medium">Remaining: ₹{Math.max(monthlyLimit - monthlyDebit, 0).toLocaleString()}</p>
                        <p className="font-medium">Credited: <span className="text-green-500">₹{monthlyCredit.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
    }

export default FinanceDashboard;