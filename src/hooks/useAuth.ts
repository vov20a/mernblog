import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'
import { IUserInfo } from '../types/IUserInfo'


const useAuth = () => {
    const token = useSelector(selectCurrentToken)

    let isAuthor = false
    let isAdmin = false
    let status = "User"

    if (token) {
        const decoded: IUserInfo = jwtDecode(token)
        const { username, email, roles, id, avatarUrl } = decoded.UserInfo

        isAuthor = roles.includes('Author')
        isAdmin = roles.includes('Admin')

        if (isAuthor) status = "Author"
        if (isAdmin) status = "Admin"

        return { id, username, email, roles, status, avatarUrl, isAuthor, isAdmin }
    }

    return { id: '', username: '', email: '', roles: [], avatarUrl: '', isAuthor, isAdmin, status }
}
export default useAuth