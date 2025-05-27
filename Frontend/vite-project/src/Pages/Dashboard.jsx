import { Link } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Settings,
  BarChart2,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Sidebar from "../common/sidepannel"; // Adjust the import path as necessary

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <HelpCircle size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              JD
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Total Users"
              value="1,234"
              change="+12%"
              icon={<Users size={20} />}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              title="Reports"
              value="56"
              change="+5%"
              icon={<FileText size={20} />}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              title="Active Sessions"
              value="89"
              change="-3%"
              icon={<Users size={20} />}
              color="bg-purple-100 text-purple-600"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Activity</h3>
              <Link to="/activity" className="text-sm text-blue-500">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              <ActivityItem
                title="New user registered"
                time="2 minutes ago"
                icon={<Users size={16} />}
              />
              <ActivityItem
                title="Report submitted"
                time="15 minutes ago"
                icon={<FileText size={16} />}
              />
              <ActivityItem
                title="System updated"
                time="1 hour ago"
                icon={<Settings size={16} />}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Sidebar Item Component
const SidebarItem = ({ icon, text, active = false }) => {
  return (
    <li>
      <Link
        to={`/${text.toLowerCase()}`}
        className={`flex items-center p-2 rounded-md ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </Link>
    </li>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change.startsWith("+");
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full h-12 w-12 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`text-sm mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {change} from last week
      </p>
    </div>
  );
};

// Reusable Activity Item Component
const ActivityItem = ({ title, time, icon }) => {
  return (
    <div className="flex items-start">
      <div className="bg-gray-100 p-2 rounded-full mr-3">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-gray-500 text-sm">{time}</p>
      </div>
    </div>
  );
};

export default Dashboard;