import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Bell, CreditCard, FileSpreadsheet } from 'lucide-react';

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
    // Placeholder data
    const Debit = [
        { name: 'Jan', value: 2000 },
        { name: 'Feb', value: 200 },
        { name: 'Mar', value: 6000 },
        { name: 'Apr', value: 11400 },
        { name: 'May', value: 2600 },
    ];

    const Credit = [
        { name: 'Jan', value: 10000 },
        { name: 'Feb', value: 20000 },
        { name: 'Mar', value: 1800 },
        { name: 'Apr', value: 1700 },
        { name: 'May', value: 19000 },
    ];

    const assetData = [
        { name: 'Gold', value: 15700 },
        { name: 'Stocks', value: 22500 },
        { name: 'Real Estate', value: 120000 },
        { name: 'Land', value: 133000 },
    ];

    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Available Balance</h1>
                    <p className="text-4xl font-bold text-green-400">₹14,822</p>
                </div>
                <div className="flex space-x-4">
                    <CreditCard size={24} />
                    <FileSpreadsheet size={24} />
                    <p className="text-sm">Sunday, February 5, 2023</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card className="bg-orange-500 col-span-1">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">Total Net Worth</h2>
                        <p className="text-3xl font-bold">₹2788</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Spendings</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={Credit}>
                                <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Earnings</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={100}>
                            <LineChart data={Debit}>
                                <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-2 mt-10">
                    <CardHeader className= 'mt-10'>Income & Expenses</CardHeader>
                    <CardContent className= "mt-10">
                        <ResponsiveContainer width="100%" height={200} >
                            <LineChart data={Debit}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Line type="monotone" dataKey="value" name="Income" stroke="#00C49F" strokeWidth={2} />
                                <Line type="monotone" data={Credit} dataKey="value" name="Expenses" stroke="#FF8042" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 col-span-1">
                    <CardHeader>Assets</CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={assetData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {assetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default FinanceDashboard;