import API from "../utils/axios";
import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import { jwtDecode } from "jwt-decode";
import { getAvatar } from "../utils/avatar";
import { Search, Filter, Users, Eye, Edit2, Trash2, Plus, Option } from "lucide-react";


const EmployeesPage = () => {

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [department,setDepartment]=useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    const fetchTotalEmpAndDep = async () => {
      try {
        const userId = decoded.id || decoded._id;
        // console.log({ userId: userId });

        const totalEmp = await API.get(`/user/all-employee`);
        const totalDep = await API.get(`/department/all-department`);
        // console.log("api data:", res.data)

        setEmployees(totalEmp.data);
        setDepartment(totalDep.data);

      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      };
    }
    fetchTotalEmpAndDep();
  }, []);

  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);

  function formatSalary(n) {
    if (!n) return "₹0"
    const num = Number(n);
    return "₹" + num.toLocaleString("en-IN");
  }

  const status = (employees) => {
    return employees.isDeleted ? "Inactive" : "Active";
  }

  function EmptyState({ icon: Icon, title, desc, action }) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-400" />
        </div>
        <h3 className="text-slate-700 font-semibold text-lg mb-1">{title}</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xs">{desc}</p>
        {action}
      </div>
    );
  }

  const fillteredEmp = employees.filter(emp => {
    const nameMatch = emp.user.name.toLowerCase().includes(search.toLowerCase());

    let statusMatch = true;
    if(filter==="active") statusMatch=!emp.isDeleted
    else if(filter==="inactive") statusMatch=emp.isDeleted;

    let departmentMatch = true;
    if(
      filter!=="all"&&filter!=="active"&&filter!=="inactive"
    ){ departmentMatch=filter===emp.department?._id}

    return nameMatch && statusMatch && departmentMatch;
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value)
  };

  function deleteEmployee(id) {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  if (showForm || editTarget) {
    return (
      <EmployeeForm
        employee={editTarget}
        onSave={emp => {
          if (editTarget) setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
          else setEmployees(prev => [...prev, { ...emp, id: Date.now() }]);
          setShowForm(false); setEditTarget(null);
        }}
        onCancel={() => { setShowForm(false); setEditTarget(null); }}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-slate-800">All Employees</h2>
          <p className="text-xs text-slate-400">{employees.length} total members</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search employees..."
              className="pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
            />
          </div>
          {/* Filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <select
              value={filter}
              onChange={handleFilter}
              className="pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
            >

              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              {department.map(dep=>(
                <option key={dep._id} value={dep._id}>{dep.name}</option>
                ))}

            </select>

          </div>
          {(decoded.role === "admin" || decoded.role === "hr") && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition shadow font-medium"
            >
              <Plus size={14} /> Add Employee
            </button>
          )}
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {["Employee", "Department", "Position", "Salary", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading
              ? (<tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>)
              : fillteredEmp.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Users}
                      title="No employees found"
                      desc="Try adjusting your search or filter criteria." />
                  </td>
                </tr>
              )
                : fillteredEmp.map(emp => {
                  const { initials, color } = getAvatar(emp?.user?.name);
                  return (
                    <tr
                      key={emp._id}
                      className="border-b border-slate-50 hover:bg-indigo-50/30 transition group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700">{emp?.user?.name}</p>
                            <p className="text-xs text-slate-400">{emp?.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">{emp?.department?.name}</td>

                      <td className="px-4 py-3.5 text-slate-600">{emp.designation}</td>

                      <td className="px-4 py-3.5 font-medium text-slate-700 font-sans">{formatSalary(emp.salary)}</td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emp.isDeleted === true
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500"
                            }`}>
                          {status(emp)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">

                          <button
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                            <Eye size={14} />
                          </button>

                          {(decoded.role === "admin" || decoded.role === "hr") && (
                            <button onClick={() => setEditTarget(emp)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
                              <Edit2 size={14} />
                            </button>
                          )}

                          {(decoded.role === "admin" || decoded.role === "hr") && (
                            <button onClick={() => deleteEmployee(emp.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                              <Trash2 size={14} />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {/* <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Showing {filtered.length} of {employees.length} employees</span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition">Prev</button>
          <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">1</button>
          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition">Next</button>
        </div>
      </div> */}
    </div>
  );
}

export default EmployeesPage;

