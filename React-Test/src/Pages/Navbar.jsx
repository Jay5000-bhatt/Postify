import React, { useContext, useEffect } from "react";
import MainLogo from "../assets/Main_Logo.png";
import AuthContext from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const protectedRoutes = ["/dashboard", "/tester"];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isAuthenticated = user || token;

  useEffect(() => {
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <nav className="fixed top-0 start-0 z-20 w-full h-20 border-b border-gray-200 bg-white shadow shadow-emerald-200">
      <div className="mx-auto mt-2 mb-4 flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src={MainLogo}
            className="h-8 text-amber-400"
            alt="Postify Logo"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold">
            Postify.io
          </span>
        </a>

        {isAuthenticated && (
          <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
            <span className="self-center whitespace-nowrap text-2xl font-semibold"></span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
