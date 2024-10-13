import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Bell, Clock, Clock10, CreditCard, FileSpreadsheet, PowerOffIcon, User } from 'lucide-react';
import axios from 'axios';

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

const FinanceDashboard = () => {
    const [monthlyData, setMonthlyData] = useState([]);
    const [totalAmounts, setTotalAmounts] = useState({ totalDebit: 0, totalCredit: 0 });
    const [monthlyDebit, setMonthlyDebit] = useState(0);
    const [monthlyCredit, setMonthlyCredit] = useState(0);
    const [dailyDebit, setDailyDebit] = useState([]);
    const [dailyCredit, setDailyCredit] = useState([]);
    const [showText, setShowText] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const MONTHLY_LIMIT = 3000; // Hardcoded monthly limit
    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

    const userId = localStorage.getItem('uid');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userId) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
                const currentYear = currentDate.getFullYear();

                const [monthlyResponse, totalResponse, monthlyDebitResponse, dailyResponse] = await Promise.all([
                    axios.get(`http://localhost:3000/api/expense/allMonthSummary/${userId}/2024`),
                    axios.get(`http://localhost:3000/api/expense/${userId}/total`),
                    axios.get(`http://localhost:3000/api/expense/${userId}/monthlyDebitCredit/${currentMonth}/${currentYear}`),
                    axios.get(`http://localhost:3000/api/expense/${userId}/monthly/messages/${currentMonth}/${currentYear}`),
                ]);

                const processedData = processMonthlyData(monthlyResponse.data);
                setMonthlyData(processedData);
                setTotalAmounts({
                    totalDebit: totalResponse.data.totalDebit,
                    totalCredit: totalResponse.data.totalCredit
                });
                setMonthlyDebit(monthlyDebitResponse.data.data.totalDebit);
                setMonthlyCredit(monthlyDebitResponse.data.data.totalCredit);

                // Process daily transactions
                const dailyTransactions = dailyResponse.data.monthlyMessages;

                // Process debit transactions
                const debitTransactions = processTransactions(dailyTransactions, "Debited");
                setDailyDebit(debitTransactions);

                // Process credit transactions
                const creditTransactions = processTransactions(dailyTransactions, "Credited");
                setDailyCredit(creditTransactions);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const processTransactions = (transactions, type) => {
        const filteredTransactions = transactions
            .filter(transaction => transaction.type === type)
            .map(transaction => ({
                date: new Date(transaction.date).toLocaleDateString(),
                amount: parseFloat(transaction.amount)
            }));

        // Group transactions by date and sum amounts
        const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
            if (!acc[transaction.date]) {
                acc[transaction.date] = 0;
            }
            acc[transaction.date] += transaction.amount;
            return acc;
        }, {});

        // Convert to array format for LineChart and sort by date
        return Object.entries(groupedTransactions)
            .map(([date, amount]) => ({ date, amount }))
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
        { name: 'Remaining', value: Math.max(MONTHLY_LIMIT - monthlyDebit, 0) },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    }


        const CustomDailyTool = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white p-2 rounded">
                    <p>Date: {label}</p>
                    <p>Amount: ₹{payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-900 text-white p-4 sm:p-6 rounded-lg min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Available Balance</h1>
                    <p className="text-3xl sm:text-4xl font-bold text-green-400">₹14,822</p>
                </div>
                <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                    <Clock10 className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-xs sm:text-sm hover:text-green-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="relative">
                        <FileSpreadsheet
                            size={20}
                            className="cursor-pointer hover:text-green-400 transition-colors duration-200"
                            onMouseEnter={() => setShowText(true)}
                            onMouseLeave={() => setShowText(false)}
                        />
                        {showText && (
                            <div className="absolute right-0 mt-2 py-2 px-4 bg-gray-800 text-white text-xs sm:text-sm rounded-md shadow-lg z-10 whitespace-nowrap transition-opacity duration-200 opacity-100">
                                Download as CSV
                            </div>
                        )}
                    </div>
                    <User size={20} className='hover:text-green-400' />
                    <div onClick={handleLogout} className="relative">
                        <PowerOffIcon className='hover:text-red-600' size={20}
                            onMouseEnter={() => setShowLogout(true)}
                            onMouseLeave={() => setShowLogout(false)}
                        />
                        {showLogout && (
                            <div className="absolute right-0 mt-2 py-2 px-4 bg-gray-800 text-white text-xs sm:text-sm rounded-md shadow-lg z-10 whitespace-nowrap transition-opacity duration-200 opacity-100">
                                Logout
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-orange-500 col-span-1 sm:col-span-2 lg:col-span-1">
                    <CardContent>
                        <h2 className="text-lg sm:text-xl font-bold mb-2">Total Spendings</h2>
                        <p className="text-2xl sm:text-3xl font-bold">₹{totalAmounts.totalDebit.toLocaleString()}</p>
                    </CardContent>
                    <CardContent>
                        <h2 className="text-lg sm:text-xl font-bold mb-2">Total Earnings</h2>
                        <p className="text-2xl sm:text-3xl font-bold">₹{totalAmounts.totalCredit.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Daily Debit</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={dailyDebit}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomDailyTool />} />
                                <Line type="monotone" dataKey="amount" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Daily Credit</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={dailyCredit}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip content={<CustomDailyTool />} />
                                <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>


                <Card className="bg-gray-800 col-span-1 sm:col-span-2">
                    <CardHeader>All Year Income & Expenses</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="income" name="Income" stroke="#00C49F" strokeWidth={2} />
                                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Monthly Spending</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={getMonthlyDebitData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
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
                        <div className="text-center mt-2 text-sm sm:text-base">
                            <p>Monthly Limit: ₹{MONTHLY_LIMIT.toLocaleString()}</p>
                            <p>Spent: <span className="text-red-500">₹{monthlyDebit.toLocaleString()}</span></p>
                            <p>Remaining: ₹{Math.max(MONTHLY_LIMIT - monthlyDebit, 0).toLocaleString()}</p>
                            <p>Credited: <span className="text-green-500">₹{monthlyCredit.toLocaleString()}</span></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FinanceDashboard;