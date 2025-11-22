/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { account } from '../appwrite'

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo) => {
        setLoading(true);
        try {
            await account.createEmailPasswordSession(userInfo);
            const accountDetails = await account.get();
            setUser(accountDetails);
            setTimeout(async () => {
                await account.deleteSession({sessionId: 'current'});
                setUser(null);
                window.location.reload();
            }, 5 * 60 * 1000);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    const logoutUser = () => {
        account.deleteSession({sessionId: 'current'});
        setUser(null);
    }

    const checkUserStatus = async () => {
        setLoading(true);
        try {
            let accountDetails = await account.get();
            setUser(accountDetails)
        } catch(error) {
            console.error("ERROR", error);
        }
        setLoading(false)
    }

    let contextData = {user, loginUser, logoutUser};

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading</p> : children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;