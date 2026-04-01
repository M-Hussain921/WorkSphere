import { useState } from "react";
import API from "../utils/axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const RegisterForm = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        age: "",
    });

     const [bg, setBg] = useState("");

    useEffect(()=>{
        API.get("/forms-page-image")
        .then(res=>setBg(res.data.image));
    },[]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/user/register', formData
            );
            console.log(formData);
            console.log(res.data);

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            alert("Registered Successfully");
            window.location.href = "/dashboard";

        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("register failed")
        }
    };

    return (
        <div 
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat m-auto grid place-items-center" style={{ backgroundImage: `url(${bg})` }}>

            <div 
            className="bg-card  relative left-80 z-40 p-8 rounded-2xl shadow-card w-full max-w-md border border-border">

                <h2 className="text-2xl font-bold text-center text-text mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-xl"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-xl"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-xl"
                        required
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-xl"
                    />

                    <input
                        type="number"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        className="w-full p-2 border border-border rounded-xl"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-primary-dark text-white py-2 rounded-xl"
                    >
                        Register
                    </button>

                    <div className="text-center">
                        <Link to="/">Already have an account? login </Link>
                    </div>


                </form>

            </div>
        </div>
    );
};

export default RegisterForm;