import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { Calendar } from 'lucide-react';

const InputPage = () => {
    const currentDate = new Date();
    const [month, setMonth] = useState(currentDate.toLocaleString('default', { month: 'long' })); // Default to current month
    const [year, setYear] = useState(currentDate.getFullYear()); // Default to current year
    const [day, setDay] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const typeSelected = [
        'Debited',
        'Credited'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const monthNumber = (months.indexOf(month) + 1).toString().padStart(2, '0'); // Format month as two digits

        const userId = localStorage.getItem('uid'); // Use quotes for the uid key
        const date = `${day.padStart(2, '0')}/${(months.indexOf(month) + 1).toString().padStart(2, '0')}/${year}`;

        try {
            const response = await axios.post(`http://localhost:3000/api/addInput/${userId}/input/${monthNumber}/${year}`, {
                amount: amount.toString(),
                date,
                type,
            });

            if (response.status === 200) {
                alert('Input added successfully');
                // Reset form or handle success
            } else {
                alert('Failed to add input');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form');
        }
    };

    const isDebited = type === 'Debited';
    const primaryColor = isDebited ? 'orange' : 'green';
    const transitionClasses = 'transition-colors duration-300 ease-in-out';

    return (
        <div className={`min-h-screen bg-gray-900 flex items-center justify-center px-4 ${transitionClasses}`}>
            <div className={`max-w-md w-full bg-gray-800 rounded-lg shadow-md p-8 ${transitionClasses}`}>
                <h2 className={`text-2xl font-bold text-${primaryColor}-400 mb-6 flex items-center ${transitionClasses}`}>
                    <Calendar className="mr-2" />
                    Financial Input
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="month" className="block text-sm font-medium text-gray-300 mb-1">Month</label>
                            <select
                                id="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                required
                                className={`w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 ${transitionClasses}`}
                            >
                                <option value="">Select Month</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                                className={`w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 ${transitionClasses}`}
                            >
                                <option value="">Select Year</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="day" className="block text-sm font-medium text-gray-300 mb-1">Day</label>
                        <input
                            type="number"
                            id="day"
                            min="1"
                            max="31"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                            className={`w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 ${transitionClasses}`}
                            style={{
                                "--tw-ring-color": primaryColor, // Set ring color dynamically
                            }}
                            placeholder="Enter day (1-31)"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className={`w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 ${transitionClasses}`}
                            style={{
                                "--tw-ring-color": primaryColor, // Set ring color dynamically
                            }}
                            placeholder="Enter amount"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className={`w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 ${transitionClasses}`}
                        >
                            <option value="">Select Type</option>
                            {typeSelected.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-${primaryColor}-500 text-white py-2 px-4 rounded-md hover:bg-${primaryColor}-600 focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:ring-opacity-50 ${transitionClasses}`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InputPage;
