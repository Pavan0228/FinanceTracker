import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Bell, CreditCard, FileSpreadsheet } from 'lucide-react';
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


    const MONTHLY_LIMIT = 3000; // Hardcoded monthly limit

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
                const currentYear = currentDate.getFullYear();

                const [monthlyResponse, totalResponse, monthlyDebitResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/expense/allMonthSummary/KyHftWveuUdjgGR182uIXXKcBmC3/2024'),
                    axios.get('http://localhost:3000/api/expense/KyHftWveuUdjgGR182uIXXKcBmC3/total'),
                    axios.get(`http://localhost:3000/api/expense/KyHftWveuUdjgGR182uIXXKcBmC3/monthlyDebitCredit/${currentMonth}/${currentYear}`)
                ]);

                const processedData = processMonthlyData(monthlyResponse.data);
                setMonthlyData(processedData);
                setTotalAmounts({
                    totalDebit: totalResponse.data.totalDebit,
                    totalCredit: totalResponse.data.totalCredit
                });
                setMonthlyDebit(monthlyDebitResponse.data.data.totalDebit);
                setMonthlyCredit(monthlyDebitResponse.data.data.totalCredit);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const getMonthlyDebitData = () => [
        { name: 'Spent', value: monthlyDebit },
        { name: 'Remaining', value: Math.max(MONTHLY_LIMIT - monthlyDebit, 0) },
        

    ];



    const processMonthlyData = (data) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fullData = monthNames.map((name, index) => {
            const monthData = data.find(item => item.month === index + 1) || { totalCredit: 0, totalDebit: 0 };
            return {
                name,
                income: monthData.totalCredit,
                expenses: monthData.totalDebit
            };
        });
        return fullData;
    };
    // Placeholder data for other charts
    const assetData = [
        { name: 'Gold', value: 15700 },
        { name: 'Stocks', value: 22500 },
        { name: 'Real Estate', value: 120000 },
        { name: 'Land', value: 133000 },
    ];

    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg h-full min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Available Balance</h1>
                    <p className="text-4xl font-bold text-green-400">₹14,822</p>
                </div>
                <div className="flex space-x-4">
                    <CreditCard size={24} />
                    <FileSpreadsheet size={24} />
                    <p className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card className="bg-orange-500 col-span-1">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">Total Spendings</h2>
                        <p className="text-3xl font-bold">₹{totalAmounts.totalDebit.toLocaleString()}</p>
                    </CardContent>
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">Total Earnings</h2>
                        <p className="text-3xl font-bold">₹{totalAmounts.totalCredit.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Spendings</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={monthlyData}>
                                <Line type="monotone" dataKey="expenses" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Earnings</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={monthlyData}>
                                <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-2">
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
                        <ResponsiveContainer width="100%" height={200}>
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
                        <div className="text-center mt-2">
                            <p>Monthly Limit: ₹{MONTHLY_LIMIT.toLocaleString()}</p>
                            <p >Spent: 
                                <span className="text-red-500">₹{monthlyDebit.toLocaleString()}</span>
                            </p>
                            <p>Remaining: ₹{Math.max(MONTHLY_LIMIT - monthlyDebit, 0).toLocaleString()}</p>
                            <p> Credited :
                                <span className="text-green-500">₹{monthlyCredit.toLocaleString()}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FinanceDashboard;