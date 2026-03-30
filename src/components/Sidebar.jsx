import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Building2,
  BarChart3,
  Briefcase,
  X,
  ChevronRight,
  LogOut,
} from "lucide-react";

const MENU_ITEMS = [
  { key: "", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "hr", "employee"] },
  { key: "profile", label: "Profile", icon: User, roles: ["admin", "hr", "employee"] },
  { key: "employees", label: "Employees", icon: Users, roles: ["admin", "hr"] },
  { key: "departments", label: "Departments", icon: Building2, roles: ["admin", "hr"] },
  { key: "reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
];

function Sidebar() {
  const [open, setOpen] = useState(true)
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ get role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("DECODED TOKEN:", decoded);
      setRole(decoded.role);
    }
  }, []);

  const allowed = MENU_ITEMS.filter(m => m.roles.includes(role));

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 flex flex-col h-screen
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full" }
          `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-700/50">
          <div className="w-9 h-9  rounded-xl flex items-center justify-center">
            <img src="/workSphere-logo.png" />
          </div>
          <div>
            <p className="logo font-nunito text-white  text-xl font-thin
         tracking-widest ">WorkShpere</p>
            <p className="text-slate-400 text-xs">v2.0 - 2026</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs text-slate-500 px-3 mb-3">Navigation</p>

          <ul className="space-y-1">
            {allowed.map(item => {
              const active = location.pathname === item.key;

              return (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      navigate(item.key);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
      ${active
        ? "bg-indigo-600 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                  >
      <item.icon size={17} />
      {item.label}
      {active && <ChevronRight size={14} className="ml-auto" />}
    </button >
                </li >
              );
})}
          </ul >
        </nav >

  {/* Bottom */ }
  < div className = "px-3 pb-5 border-t border-slate-700/50 pt-4" >
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-900/30 hover:text-red-400"
    >
      <LogOut size={17} />
      Logout
    </button>
        </div >

      </aside >
    </>
  );
}

export default Sidebar;