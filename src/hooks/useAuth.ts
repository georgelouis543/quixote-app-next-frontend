import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
    username: string
    user_email: string
    user_role: 'user' | 'admin' | string
  }

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let isUser = false
    let status = "user"

    if (token) {
        const decoded = jwtDecode<DecodedToken>(token)
        const { 
            username, 
            user_email, 
            user_role 
        } = decoded

        isAdmin = user_role === "admin"
        isUser = user_role === "user"

        if (user_role === "admin") status = "admin"
        if (user_role === "user") status = "user"

        return { 
            username, 
            user_email, 
            status, 
            isAdmin, 
            isUser,
        }
    }

    return { 
        username: '', 
        user_email: '', 
        status, 
        isAdmin, 
        isUser, 
    }
}
export default useAuth