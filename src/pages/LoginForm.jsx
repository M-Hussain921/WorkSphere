import API from "../utils/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {

    const navigate = useNavigate();
    const [bg, setBg] = useState("");

    useEffect(() => {
        API.get("/forms-page-image")
            .then(res => setBg(res.data.image));
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/user/login',
                formData
            );
            console.log(formData);
            console.log(res.data);
            localStorage.setItem("token", res.data.token);

            navigate("/home");

            alert("login successfully");

        } catch (err) {
            console.log(err.response?.data || err.message);
            alert("Login failed");
        }
    };

    return (

        <div
            className="min-h-screen  w-full bg-cover bg-center bg-no-repeat grid place-items-center" style={{ backgroundImage: `url(${bg})` }}>

            <div className="bg-card relative left-80 z-40 p-8 rounded-2xl shadow-card w-full max-w-md border-2 border-gray-400">

                <div className="flex justify-center gap-3.5 items-center pb-3.5">
                    <img className="w-19" src="/workSphere-logo.png" alt="logo" />
                    <h2 className="logo text-3xl  font-thin
        text-cyan-700 tracking-widest font-nunito pt-4 text-center 
                    text-text mb-6">WorkSphere</h2>
                </div>




                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        className="w-full p-2 border-2 border-gray-400 rounded-xl" />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        className="w-full p-2 border-2 border-gray-400 rounded-xl" />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-primary-dark text-white py-2 rounded-xl">
                        Login</button>

                    <div className="text-center">
                        <Link to="/register">Don't have an account? Resgister</Link>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default LoginForm;