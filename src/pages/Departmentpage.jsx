import { useState,useEffect } from "react";
import API from "../utils/axios";
import { Building2, } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const DepartmentsPage=()=> {
  const [departments,setDepartment]=useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded=jwtDecode(token);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);

useEffect(()=>{
  const fetchDepartment= async()=>{
    try{
      const totalDep=await API.get(`/department/all-department`);
      console.log("api data:", totalDep);
      console.log(totalDep.data)
      setDepartment(totalDep.data)

    } catch(err){
console.error("FETCH ERROR:", err.response?.data || err.message);
    }
  }
  fetchDepartment()
},[]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-40" />
            ))
          : departments.map(dept => {
              const depCount = departments.filter(e => e.dept === dept.name).length;
              // const deptEmps = employees.filter(e => e.dept === dept.name);
              return (
                <div key={dept.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition">
                      <Building2 size={20} className="text-indigo-600" />
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-0.5">{dept.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">Head: {dept.head}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Employees</p>
                      {/* <p className="font-bold text-slate-700 text-lg">{empCount}</p> */}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Budget</p>
                      <p className="font-bold text-slate-700">₹{(dept.budget / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="flex -space-x-2">
                      {/* {deptEmps.slice(0, 3).map(e => (
                        <div key={e.id} className={`w-7 h-7 ${getAvatarColor(e.id)} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                          {e.avatar[0]}
                        </div>
                      ))} */}
                      {/* {empCount > 3 && (
                        <div className="w-7 h-7 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold">
                          +{empCount - 3}
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default DepartmentsPage;