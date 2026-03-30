// ─── EMPLOYEE FORM ────────────────────────────────────────────
function EmployeeForm({ employee, onSave, onCancel }) {
  const [form, setForm] = useState(employee || {
    name: "", email: "", phone: "", role: "employee",
    dept: "Engineering", position: "", salary: "", status: "active", joined: "", avatar: ""
  });

  function handle(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const initials = form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    onSave({ ...form, avatar: initials || "??" });
  }

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "John Doe" },
    { label: "Email", name: "email", type: "email", placeholder: "john@company.com" },
    { label: "Phone", name: "phone", type: "text", placeholder: "+91 98765 00000" },
    { label: "Position", name: "position", type: "text", placeholder: "Software Engineer" },
    { label: "Salary (₹)", name: "salary", type: "number", placeholder: "75000" },
    { label: "Date Joined", name: "joined", type: "date", placeholder: "" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <User size={18} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">{employee ? "Edit Employee" : "Add New Employee"}</h2>
          <p className="text-xs text-slate-400">Fill in the employee details below</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
              <input
                type={f.type} name={f.name} value={form[f.name] || ""}
                onChange={handle} placeholder={f.placeholder} required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition"
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Department", name: "dept", options: ["Engineering", "HR", "Marketing", "Design", "Finance", "Management"] },
            { label: "Role", name: "role", options: ["employee", "hr", "admin"] },
            { label: "Status", name: "status", options: ["active", "inactive"] },
          ].map(sel => (
            <div key={sel.name}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{sel.label}</label>
              <select name={sel.name} value={form[sel.name]} onChange={handle}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 capitalize appearance-none cursor-pointer">
                {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow">
            {employee ? "Save Changes" : "Add Employee"}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;