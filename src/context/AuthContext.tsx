import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// тут визначаємо як виглядає пустий юзер
export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
};

// тут визначаємо початковий стан Auth щоб постійно розуміти стан юзера
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};

//  "<IUser>" таким чином ми даємо точно знати typescript як виглядаюзер
const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    //   we need call after reload page so use useEffect
    const checkAuthUser = async () => {
        try {
            // fn directly from appwrite
            const currentAccount = await getCurrentUser();

            // if currentAccount exist => set our user
            if (currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio,
                });

                setIsAuthenticated(true);

                return true;
            }

            // if currentAccount don't exist => return false
            return false;
        } catch (error) {
            console.log(error);
            // false = user not authenticated
            return false;
        } finally {
            // mean we done with loading
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // localStorage.getItem("cookieFallback") === null
        if (
            localStorage.getItem("cookieFallback") === "[]" 
        ) {
            navigate("/sign-in");
        }

        checkAuthUser();
    }, []);

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// this is way easy to call
export const useUserContext = () => useContext(AuthContext);
