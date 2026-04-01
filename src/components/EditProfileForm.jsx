import { User } from "lucide-react";

const EditProfile=({formRef,user,setuser})=>{
    const Form_fields=[
        {lable:"Full Name",name:"name",type:"name",placeholer:user?.user?.name},
        {lable:"Email",name:"email",type:"email",placeholer:user?.user?.email},
        {lable:"Phone Number",name:"phone",type:"text",placeholer:user?.user?.phoneNumber}
    ]
    return(
    <div ref={formRef}>
    <div>
        <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <User size={18} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Edit Profile</h2>
        </div>
      </div>
    </div>
    </div>
    )
}

export default EditProfile;