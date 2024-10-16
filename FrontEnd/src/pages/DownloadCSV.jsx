import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, FileSpreadsheet, Eye, Calendar , Loader } from "lucide-react";
import {
    fetchDailyTransactions,
    getYearlyMessages,
} from "../store/expensesSlice";
import { useDispatch } from "react-redux";

const DownloadFiles = () => {
    const [jsonData, setJsonData] = useState([]);
    const [totals, setTotals] = useState({ credited: 0, debited: 0 });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);

    const userId = localStorage.getItem("uid");
    const dispatch = useDispatch();

    useEffect(() => {
        fetchMonthlyMessages();
    }, [userId, dispatch, selectedMonth, selectedYear]);

    const fetchDailyData = async () => {
        const dailyResponse = await dispatch(
            fetchDailyTransactions({
                userId,
                currentMonth: selectedMonth,
                currentYear: selectedYear,
            })
        ).unwrap();
        return dailyResponse.monthlyMessages;
    }

    const fetchYearlyData = async () => {
        const yearlyResponse = await dispatch(
            getYearlyMessages({
                userId,
                year: selectedYear,
            })
        ).unwrap();
        return yearlyResponse.data;
    }

    const fetchMonthlyMessages = async () => {
        setIsLoading(true);
        try {
            const messages = await fetchDailyData();

            let creditedTotal = 0;
            let debitedTotal = 0;
            messages.forEach((message) => {
                if (message.type === "Credited") {
                    creditedTotal += parseFloat(message.amount);
                } else if (message.type === "Debited") {
                    debitedTotal += parseFloat(message.amount);
                }
            });

            setJsonData(messages);
            setTotals({ credited: creditedTotal, debited: debitedTotal });
        } catch (error) {
            console.error("Error fetching monthly messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return dateString.split(" ")[0];
    };

    const downloadExcel = async (isYearly = false) => {
        setIsLoading(true);
        try {
            const data = isYearly ? await fetchYearlyData() : jsonData;
            const filename = isYearly 
                ? `yearly_transactions_${selectedYear}.xlsx`
                : `transactions_${selectedMonth}_${selectedYear}.xlsx`;
            
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error("Error downloading Excel:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = (data, title) => {
        const doc = new jsPDF();
        doc.text(title, 20, 10);
        const headers = [["Amount", "Date", "Sender", "Type"]];
        const pdfData = data.map((item) => [
            item.amount,
            formatDate(item.date),
            item.sender,
            item.type,
        ]);
        doc.autoTable({ head: headers, body: pdfData });
        return doc;
    };

    const downloadPDF = async (isYearly = false) => {
        setIsLoading(true);
        try {
            const data = isYearly ? await fetchYearlyData() : jsonData;
            const filename = isYearly 
                ? `yearly_transactions_${selectedYear}.pdf`
                : `transactions_${selectedMonth}_${selectedYear}.pdf`;
            const title = isYearly
                ? `Yearly Transactions for ${selectedYear}`
                : `Transactions for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`;
            
            const doc = generatePDF(data, title);
            doc.save(filename);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const viewPDF = async (isYearly = false) => {
        setIsLoading(true);
        try {
            const data = isYearly ? await fetchYearlyData() : jsonData;
            const title = isYearly
                ? `Yearly Transactions for ${selectedYear}`
                : `Transactions for ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`;
            
            const doc = generatePDF(data, title);
            window.open(doc.output("bloburl"), "_blank");
        } catch (error) {
            console.error("Error viewing PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const LoadingOverlay = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg flex items-center">
                <Loader className="animate-spin mr-2 text-blue-500" />
                <span className="text-gray-800">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            {isLoading && <LoadingOverlay />}
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Financial Reports</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Monthly Reports</h2>
                        <div className="flex space-x-4 mb-4">
                            <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="bg-gray-700 text-white rounded-md px-3 py-2"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="bg-gray-700 text-white rounded-md px-3 py-2"
                            >
                                {[...Array(5)].map((_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => downloadExcel(false)}
                                className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                <FileSpreadsheet className="mr-2" />
                                Download Excel
                            </button>
                            <button
                                onClick={() => downloadPDF(false)}
                                className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                            >
                                <Download className="mr-2" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">Yearly Report</h2>
                        <div className="flex space-x-4 mb-4">
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="bg-gray-700 text-white rounded-md px-3 py-2"
                            >
                                {[...Array(5)].map((_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => downloadExcel(true)}
                                className="flex items-center justify-center p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                            >
                                <FileSpreadsheet className="mr-2" />
                                Excel
                            </button>
                            <button
                                onClick={() => downloadPDF(true)}
                                className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                            >
                                <Download className="mr-2" />
                                PDF
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">View Reports</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => viewPDF(false)}
                            className="flex items-center justify-center w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                        >
                            <Eye className="mr-2" />
                            View Monthly PDF
                        </button>
                        <button
                            onClick={() => viewPDF(true)}
                            className="flex items-center justify-center w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            <Eye className="mr-2" />
                            View Yearly PDF
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-green-600 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-2">Total Credited</h3>
                            <p className="text-2xl font-bold">${totals.credited.toFixed(2)}</p>
                        </div>
                        <div className="bg-red-600 rounded-lg p-4">
                            <h3 className="text-lg font-medium mb-2">Total Debited</h3>
                            <p className="text-2xl font-bold">${totals.debited.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadFiles;




// const DownloadFiles = () => {
//     const [jsonData, setJsonData] = React.useState([]);
//     const [totals, setTotals] = React.useState({ credited: 0, debited: 0 });

//     const userId = localStorage.getItem("uid");

//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
//     const currentYear = currentDate.getFullYear();

//     useEffect(() => {
//         const fetchMonthlyMessages = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:3000/api/expense/${userId}/monthly/messages/${currentMonth}/${currentYear}`
//                 );
//                 const messages = response.data.monthlyMessages;

//                 // Calculate totals for credited and debited
//                 let creditedTotal = 0;
//                 let debitedTotal = 0;
//                 messages.forEach((message) => {
//                     if (message.type === "Credited") {
//                         creditedTotal += parseFloat(message.amount);
//                     } else if (message.type === "Debited") {
//                         debitedTotal += parseFloat(message.amount);
//                     }
//                 });

//                 setJsonData(messages);
//                 setTotals({ credited: creditedTotal, debited: debitedTotal });
//             } catch (error) {
//                 console.error("Error fetching monthly messages:", error);
//             }
//         };

//         fetchMonthlyMessages();
//     }, [userId]);

//     const formatDate = (dateString) => {
//         // Extract only the date part (yyyy-mm-dd)
//         return dateString.split(" ")[0];
//     };

//     const downloadCSV = () => {
//         const csvRows = [];
//         const headers = Object.keys(jsonData[0]);
//         csvRows.push(headers.join(","));

//         jsonData.forEach((item) => {
//             const values = headers.map((header) => item[header]);
//             csvRows.push(values.join(","));
//         });

//         const csvString = csvRows.join("\n");
//         const blob = new Blob([csvString], { type: "text/csv" });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.setAttribute("href", url);
//         a.setAttribute("download", "transactions.csv");
//         a.click();
//         window.URL.revokeObjectURL(url);
//     };

//     // Excel Download
//     const downloadExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(jsonData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
//         XLSX.writeFile(workbook, "transactions.xlsx");
//     };

//     // PDF Download and View
//     const generatePDF = () => {
//         const doc = new jsPDF();

//         // Add Title
//         doc.text("Transaction Details", 20, 10);

//         // Add Table Headers
//         const headers = [["Amount", "Date", "Sender", "Type"]];

//         // Add Data
//         const data = jsonData.map((item) => [
//             item.amount,
//             formatDate(item.date),
//             item.sender,
//             item.type,
//         ]);

//         // Table Format using autoTable
//         doc.autoTable({
//             head: headers,
//             body: data,
//         });

//         return doc;
//     };

//     // Download PDF
//     const downloadPDF = () => {
//         const doc = generatePDF();
//         doc.save("transactions.pdf");
//     };

//     // View PDF
//     const viewPDF = () => {
//         const doc = generatePDF();
//         window.open(doc.output("bloburl"), "_blank");
//     };

//     return (
//         <div>
//             <h1>Download and View Files</h1>
//             <br />
//             <button onClick={downloadCSV}>Download CSV</button>
//             <br />
//             <button onClick={downloadExcel}>Download Excel</button>
//             <br />
//             <button onClick={downloadPDF}>Download PDF</button>
//             <br />
//             <button onClick={viewPDF}>View PDF</button>
//         </div>
//     );
// };

// export default DownloadFiles;
