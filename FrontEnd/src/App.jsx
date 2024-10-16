import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DownloadCSV from "./pages/DownloadCSV";
import TransactionTable from "./pages/TransactionTable";
import Sidebar from "./components/Sidebar"; // Import the new Sidebar component
import HelpPage from './pages/Help';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Render Sidebar only for protected routes */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/*" element={<Sidebar />} />
        </Routes>
        
        <div className="flex-grow overflow-auto">
          <Routes>
            {/* Public route */}
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/download" element={<ProtectedRoute element={<DownloadCSV />} />} />  
            <Route path="/Help" element={<ProtectedRoute element={<HelpPage />} />} />  

            <Route path="/transaction-table" element={<ProtectedRoute element={<TransactionTable />} />} />  
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;