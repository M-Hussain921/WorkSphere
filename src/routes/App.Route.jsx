import { Routes, Route } from "react-router-dom";
import EmployeePage from "../pages/EmployeePage";
// import EmployeeData from "../pages/EmployeePage";
import LoginForm from "../pages/LoginForm";
import Dashboard from "../pages/Dashboard";
import RegisterForm from "../pages/RegisterForm";
import ProfilePage from "../pages/Profilepage";
import DepartmentsPage from "../pages/Departmentpage";
import Layout from "../components/Layout";
import ProtectedRoute from "../auth/ProtectedRoute";
import ReportPage from "../pages/ReportPage";

const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={<LoginForm />} />;
            <Route path="/register" element={<RegisterForm />} />

            <Route path="/home" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>}>

                <Route index element={<Dashboard />} />
                <Route path="profile" element={<ProfilePage />} />
                 <Route path="employees" element={<EmployeePage />} />
                  {/* <Route path="employee-form" element={<EmployeeForm />} /> */}
                 <Route path="departments" element={<DepartmentsPage />} />
                 <Route path="reports" element={<ReportPage />} />
               
            </Route>
        </Routes>
    )
}

export default AppRoutes;