import { Navigate, Outlet } from "react-router-dom"
import authService from "../services/authService"

const ProtectedRoutes = () => {
    return authService.isSignedIn() ? <Outlet /> : <Navigate to='/signin' />
}

export default ProtectedRoutes;