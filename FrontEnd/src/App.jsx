import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DownloadCSV from "./pages/DownloadCSV";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        
        {/* Protected route */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/download" element={<ProtectedRoute element={<DownloadCSV />} />} />  
      </Routes>
    </Router>
  );
}

export default App;
