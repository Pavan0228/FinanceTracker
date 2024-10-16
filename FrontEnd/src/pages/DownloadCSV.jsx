import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Download, FileSpreadsheet, Eye } from "lucide-react";

const DownloadFiles = () => {
    const [jsonData, setJsonData] = useState([]);
    const [totals, setTotals] = useState({ credited: 0, debited: 0 });

    const userId = localStorage.getItem("uid");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        const fetchMonthlyMessages = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/expense/${userId}/monthly/messages/${currentMonth}/${currentYear}`
                );
                const messages = response.data.monthlyMessages;

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
            }
        };

        fetchMonthlyMessages();
    }, [userId]);

    const formatDate = (dateString) => {
        return dateString.split(" ")[0];
    };

    // Excel Download
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.xlsx");
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.text("Transaction Details", 20, 10);

        const headers = [["Amount", "Date", "Sender", "Type"]];

        const data = jsonData.map((item) => [
            item.amount,
            formatDate(item.date),
            item.sender,
            item.type,
        ]);

        doc.autoTable({
            head: headers,
            body: data,
        });

        return doc;
    };

    const downloadPDF = () => {
        const doc = generatePDF();
        doc.save("transactions.pdf");
    };

    const viewPDF = () => {
        const doc = generatePDF();
        window.open(doc.output("bloburl"), "_blank");
    };

    return (
        <div className="w-screen min-h-screen h-auto   bg-gray-800">

        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Download and View Files</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={downloadExcel}
                    className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                >
                    <FileSpreadsheet className="mr-2" />
                    Download Excel
                </button>
                <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                    <Download className="mr-2" />
                    Download PDF
                </button>
                <button
                    onClick={viewPDF}
                    className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                    <Eye className="mr-2" />
                    View PDF
                </button>
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
