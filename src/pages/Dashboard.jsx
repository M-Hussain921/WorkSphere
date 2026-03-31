import {useState, useMemo, useEffect} from "react";
import API from "../utils/axios";
import {
  Users,
  UserCheck,
  Building2,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard({ role}) {

const [employees,setEmployees]=useState([]);
const [departments, setDepartments]=useState([]);
const [loading,setLoading]=useState(true);

const status = (employees) => {
    return employees.isDeleted ? "Inactive" : "Active";
  }


useEffect(()=>{
const fetchData=async ()=>{
    try{
      const empRes= await API.get('/user/all-employee');
      const depRes= await API.get('/department/all-department');

      setEmployees(empRes.data);
      setDepartments(depRes.data);
      // console.log(empRes.data)
      // console.log(depRes.data)
    } catch(err){
      console.error("API error",err)
    } finally{
      setLoading(false);
    };
  };
  fetchData();
},[]);

 const active = (employees || []).filter(
  (emp) => emp.isDeleted === false
);

  const stats = [
    {
      title: "Total Employees",
      value: employees?.length||0,
      sub: "this month",
      trend: 8,
      icon: Users,
      color: "bg-indigo-500"
    },
    {
      title: "Active Staff",
      value: active.length,
      sub: "vs last month",
      trend: 4,
      icon: UserCheck,
      color: "bg-emerald-500"
    },
    {
      title: "Departments",
      value: departments?.length||0,
      sub: "operational",
      trend: 0,
      icon: Building2,
      color: "bg-violet-500"
    },
  
    {
      title: "Avg Salary",
      value:
        employees?.length > 0
          ? Math.round(
              employees.reduce((acc, e) => acc + (e.salary || 0), 0) /
                employees.length
            )
          : 0,
      icon: Clock,
      color: "bg-amber-500",
    },
  ];

   const deptData = useMemo(() => {
    const map = {};
    employees?.forEach(emp => {
      const dept = emp.department?.name || "Unknown";
      map[dept] = (map[dept] || 0) + 1;
    });

    return Object.keys(map).map((key, i) => ({
      name: key,
      value: map[key],
      color: ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"][i % 4],
    }));
  }, [employees]);

    return (
    <div className="space-y-6 mt-4 overflow-hidden">
    
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow border border-slate-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400">{s.title}</p>
              <h2 className="text-xl font-bold text-slate-700">{s.value}</h2>
            </div>
            <div className={`${s.color} p-2 rounded-lg text-white`}>
              <s.icon size={18} />
            </div>
          </div>
        ))}
      </div>

    
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        
        <div className="xl:col-span-2 bg-white p-5 rounded-xl shadow border border-slate-100">
          <h3 className="font-bold mb-4">Employees Trend</h3>

          {loading ? (
            <div className="h-48 bg-slate-100 animate-pulse rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={employees}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="user.name" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="salary" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

    
        <div className="bg-white p-5 rounded-xl shadow border border-slate-100">
          <h3 className="font-bold mb-4">Department</h3>

          {loading ? (
            <div className="h-48 bg-slate-100 animate-pulse rounded" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={deptData} dataKey="value">
                    {deptData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-1">
                {deptData.map((d, i) => (
                  <p key={i} className="text-xs text-slate-500">
                    {d.name} ({d.value})
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow border border-slate-100">
        <div className="px-5 py-3 border-b border-slate-100 font-bold">
          Recent Employees
        </div>

        {loading ? (
          <div className="p-4 text-sm text-slate-400">Loading...</div>
        ) : (
          employees?.slice(0, 5).map((emp) => (
            <div
              key={emp._id}
              className="flex justify-between px-5 py-3 border-b border-slate-100 text-sm"
            >
              <div>
                <p className="font-medium">{emp.user?.name}</p>
                <p className="text-slate-400 text-xs">
                  {emp.designation} • {emp.department?.name}
                </p>
              </div>

              <span className="text-xs bg-green-100 px-2 py-1 rounded">
                {emp.status || "active"}
              </span>
            </div>
          ))
        )}
      </div>

      
      {role === "admin" && (
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-bold">Admin Panel</h3>
          <p className="text-sm text-slate-500">
            You have full system access.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;