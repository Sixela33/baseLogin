import axios from '../api/axios';
import useAuth from './useAuth';
import { jwtDecode } from "jwt-decode"

// This hook keeps the user logged in when refreshing the page. all the user info is stored in local storage to maximize security
// A http only cookie is used to store a refresh token that allows the page to get the user info when needed. this cookie is isolated
// and cannot be acessed by javascript

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/api/users/refresh', {
                withCredentials: true
            });
    
            if (response.data && typeof response.data === 'string' && response.data.trim() !== '' && !response.data.includes('<')) {
                setAuth(prev => {
                    const decoded = jwtDecode(response.data);
                    return {
                        ...prev,
                        decoded: decoded,
                        accessToken: response.data
                    };
                });
                return response.data.accessToken;
            } else {
                throw new Error('Invalid token response');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            setAuth({});
            return null;
        }
    }
    
    return refresh;
};

export default useRefreshToken;