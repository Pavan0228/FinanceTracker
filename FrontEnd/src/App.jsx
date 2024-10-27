import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DownloadCSV from "./pages/DownloadCSV";
import TransactionTable from "./pages/TransactionTable";
import SideBar from "./components/SideBar";
import HelpPage from './pages/Help';
import Yearly from './pages/Yearly';
import InputPage from './pages/InputPage';
import UserPage from './pages/UserPage';
import AboutUsPage from './pages/AboutUs';
import Footer from './components/Footer';

// Footer wrapper component to conditionally render footer
const FooterWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  
  if (isLoginPage) return null;
  
  return (
    <div className="w-full mt-9">
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main content area with sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sticky Sidebar */}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/*" element={
              <div className="sticky top-0 h-screen">
                <SideBar />
              </div>
            } />
          </Routes>
          
          {/* Scrollable main content */}
          <div className="flex-1 flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
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
                <Route path="/AboutUs" element={<ProtectedRoute element={<AboutUsPage />} />} />  
              </Routes>
            </div>
          </div>
        </div>

        {/* Conditional Footer */}
        <FooterWrapper />
      </div>
    </Router>
  );
}

// Add these styles to your global CSS file (e.g., index.css or App.css)
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* For IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

// Add style tag to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;