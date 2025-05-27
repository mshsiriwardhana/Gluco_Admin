import React, { useState } from "react";
import {
  Home,
  Image,
  Settings,
  PawPrint,
  BarChart,
  Mail,
  Menu,
  X,
  LogOut,
  User,
  CircleDollarSign,
  MessageCircleHeart,
  NewspaperIcon,
  Landmark,
  Hospital,
  Stethoscope,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext/context"; // Adjust path as needed
import { doSignOut } from "../../../../Backend/Auth/auth"; // Adjust path as needed

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Expect currentUser to include email property

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/AdminDashboard" },
    { title: "Hospital", icon: Hospital, path: "/Hospital" },
    { title: "Doctors", icon: Stethoscope, path: "/Doctors" },
    { title: "Patients", icon: Mail, path: "/Patients" },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    doSignOut()
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div
      className={`
        ${isCollapsed ? "w-16" : "w-64"} 
        h-screen transition-all duration-300 flex flex-col
        ${
          isDarkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800 border-r"
        }
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            {/* GIF added here - replace the src with your actual GIF URL */}
            <img
              src="/src/assets/medical-support.gif"
              alt="Admin Logo"
              className="h-12 w-12 mr-2"
            />
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1 rounded-lg transition-colors ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`
              flex items-center px-4 py-3 transition-colors
              ${
                location.pathname === item.path
                  ? isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-900"
                  : isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
              ${isCollapsed ? "justify-center px-0" : ""}
            `}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-4">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Fixed bottom section for theme, logout, and profile */}
      <div
        className={`mt-auto border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {/* Theme Toggle and Logout */}
        <div className="p-4 flex flex-col gap-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center rounded-lg transition-colors
              ${
                isDarkMode
                  ? "hover:bg-red-900/20 text-red-400 hover:text-red-300"
                  : "hover:bg-red-50 text-red-600 hover:text-red-700"
              }
              ${isCollapsed ? "justify-center p-2" : "px-4 py-2"}
            `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="ml-4">Logout</span>}
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 flex ${isCollapsed ? "justify-center" : ""}`}>
          {isCollapsed ? (
            <User
              size={20}
              className={isDarkMode ? "text-gray-400" : "text-gray-600"}
            />
          ) : (
            <div className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {currentUser && currentUser.email
                    ? currentUser.email
                    : "Guest"}
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Admin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
