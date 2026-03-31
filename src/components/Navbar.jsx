import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../utils/axios";
import { getAvatar } from "../utils/avatar";
import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Shield,
  Activity,
  LogOut,
  AlertCircle,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_CONFIG = {
  admin: { label: "Admin", color: "bg-red-100 text-red-600" },
  hr: { label: "HR", color: "bg-blue-100 text-blue-600" },
  employee: { label: "Employee", color: "bg-green-100 text-green-600" },
};

function Navbar({ sidebarOpen, setSidebarOpen }) {

  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  const location=useLocation();

  const avatar = getAvatar(currentUser?.user?.name);

  const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

  const PAGE_TITLES = {
    "/": "Dashboard",
    "/home/profile": "My Profile",
    "/home/employees": "Employees",
    "/home/departments": "Departments",
    "/home/reports": "Reports"
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId=decoded.id||decoded._id;

        const res = await API.get(`/user/employee/${userId}`)
        
        setCurrentUser(res.data.data);
      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      };
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-100 px-4 lg:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-10 shadow-sm">

  
      <button
        className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </button>

    
      <div>
        <h1 className="font-bold text-slate-800 text-lg">
          {PAGE_TITLES[location.pathname] || "Dashboard"}
        </h1>
        <p className="text-xs text-slate-400">
          Welcome back, {currentUser?.user?.name.toUpperCase() || "User"}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-5">

  
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow border border-slate-100 p-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">Notifications</p>

              {[
                { icon: UserCheck, text: "New employee joined" },
                { icon: AlertCircle, text: "Budget review pending" },
                { icon: CheckCircle, text: "Report generated" },
              ].map((n, i) => (
                <div key={i} className="flex gap py-2 text-sm">
                  <n.icon size={14} />
                  {n.text}
                </div>
              ))}
            </div>
          )}
        </div>

      
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropOpen(!dropOpen)}
            className="flex items-center gap px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            <div className={`w-8 h-8 ${avatar.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {avatar.initials}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold">{currentUser?.name}</p>
              <span className={`text-xs px-1 rounded ${ROLE_CONFIG[currentUser?.role]?.color}`}>
                {ROLE_CONFIG[currentUser?.role]?.label}
              </span>
            </div>

            <ChevronDown size={14} />
          </button>

          {dropOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow border border-slate-100">

              <div className="p-3 border-b border-slate-100">
                <p className="font-semibold">{currentUser?.name}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>

              <button
              onClick={()=>navigate("profile")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <User size={14} />My Profile
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <Shield size={14} /> Settings
              </button>

              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2">
                <Activity size={14} /> Activity
              </button>

              <div className="border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;