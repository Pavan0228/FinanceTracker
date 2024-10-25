import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DownloadCSV from "./pages/DownloadCSV";
import TransactionTable from "./pages/TransactionTable";
import SideBar from "./components/SideBar"; // Import the new Sidebar component
import HelpPage from './pages/Help';
import Yearly from './pages/Yearly';
import InputPage from './pages/InputPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Render Sidebar only for protected routes */}
        <Routes>
          <Route path="/" element={null} />
          <Route path="/*" element={<SideBar />} />
        </Routes>
        
        <div className="flex-grow overflow-auto">
          <Routes>
            {/* Public route */}
            <Route path="/" element={<PublicRoute element={<Login />} />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/download" element={<ProtectedRoute element={<DownloadCSV />} />} />  
            <Route path="/Help" element={<ProtectedRoute element={<HelpPage />} />} />  
            <Route path="/yearly" element={<ProtectedRoute element={<Yearly />} />} />  
            <Route path="/input" element={<ProtectedRoute element={<InputPage />} />} />  
            <Route path="/user" element={<ProtectedRoute element={<UserPage />} />} />  
            <Route path="/Daily" element={<ProtectedRoute element={<TransactionTable />} />} />  
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;