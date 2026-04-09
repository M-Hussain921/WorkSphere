import { User } from "lucide-react";
import API from "../utils/axios";


const EditProfile = ({ formRef, user, setuser }) => {

  const handleChange = (e) => {
    setuser({ ...user, user:{ ...user.user, [e.target.name]: e.target.value }})
    console.log(user)
}

const payload={
  name:user?.user?.name,
  email:user?.user?.email,
  phoneNumber:user?.user?.phoneNumber,
  age:user?.user?.age,
}

const handleSubmit = async (e) => {
e.preventDefault()
  try {
    const res = await API.put(`user/edit-user/${user?.user?._id}`,payload);
    console.log(res.data.data)
    setuser({...user,user:res.data.data})
  } catch(err) {
    console.error("FETCH ERROR:", err.response?.data || err.message);
  }
}


return (
  <div ref={formRef} className="border backdrop-blur-3xl p-10 rounded-xl">
    <div className="">
      <div className="flex justify-center items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <User size={18} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Edit Profile</h2>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="grid gap-3.5">
          <input className="border" type="text" name="name" value={user?.user?.name} onChange={handleChange} />
          <input className="border" type="email" name="email" value={user?.user?.email} onChange={handleChange} />
          <input className="border" type="phone" name="phoneNumber" value={user?.user?.phoneNumber} onChange={handleChange} />
          <div className="flex justify-between px-2">
            <button type="reset">Reset</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)
}

export default EditProfile;