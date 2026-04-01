import { useEffect, useState, useRef } from "react";
import API from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { getAvatar } from "../utils/avatar";
import { Edit2, Mail, Phone, MapPin, Calendar, Award } from "lucide-react";
import EditProfile from "../components/EditProfileForm";

function ProfilePage() {

  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setEditOpen(false)
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatar = getAvatar(user?.user?.name);
  console.log(user)

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  function formatSalary(n) {
    if (!n) return "₹0"
    const num = Number(n);
    return "₹" + num.toLocaleString("en-IN");
  }

  const status = (user) => {
    return user.isDeleted ? "Inactive" : "Active";
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = decoded.id || decoded._id;
        const res = await API.get(`/user/employee/${userId}`);
        console.log(res.data.data);
        console.log("API RESPONSE:", res);
        console.log("DATA:", res.data.data);
        setUser(res.data.data);
      } catch (err) {
        console.error("FETCH ERROR:", err.response?.data || err.message);
      };
    }
    fetchUser();
  }, []);


  return (
    <div className="max-w-screen space-y-5 mt-4">
      {/* Cover */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-35 bg-linear-to-br from-indigo-500 via-violet-600 to-purple-700" />
        <div className="px-6 pb-6">
          <div className="flex  items-center gap-4 -mt-10 mb-4">
            <div className={`w-20 h-20 ${avatar.color} rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {avatar.initials}
            </div>
            <div className="pb-2">
              <h2 className="text-xl font-bold text-slate-800">{user?.user?.name}</h2>
              <p className="text-slate-500 text-sm">{user?.designation}</p>
            </div>
            <div ref={formRef} className="ml-auto pb-2">
              <button 
              onClick={()=>setEditOpen(!editOpen)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition shadow-sm font-medium">
                <Edit2 size={13} /> Edit Profile
              </button> 
              {editOpen&&(
                <div className="relative">
                  <EditProfile formRef={formRef} user={user} setuser={setUser} />
                  </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: "Department", value: user?.department?.name },
              { label: "Role", value: user?.user?.role },
              { label: "Status", value: status(decoded) },
              { label: "Joined", value: new Date(user?.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" }) },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700 capitalize mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Contact Information</h3>
        <div className="space-y-3.5">
          {[
            { icon: Mail, label: "Email", value: user?.user?.email },
            { icon: Phone, label: "Phone", value: user?.user?.phoneNumber },
            { icon: MapPin, label: "Location", value: "Jaipur, Rajasthan, India" },
            { icon: Calendar, label: "Date Joined", value: new Date(user?.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" }) },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <item.icon size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary (hidden from employee self) */}
      <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium ">Monthly Salary</p>
            <p className="text-4xl font-bold mt-1 font-sans">{formatSalary(user?.salary)}</p>
            <p className="text-indigo-200 text-xs mt-1 font-sa">Per annum: {formatSalary(user?.salary * 12)}</p>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <Award size={28} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProfilePage;