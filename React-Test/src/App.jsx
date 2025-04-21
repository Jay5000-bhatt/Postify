import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import AuthContext from "./Context/AuthContext";
import Tester from "./Pages/Tester";
import Navbar from "./Pages/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tester" element={<Tester />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
