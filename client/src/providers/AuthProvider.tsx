import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
    name: string;
    email: string;
    age: number;
}

interface AuthenticationContextInterface {
    login?: (user: User, token: string, role: string) => void;
    logout?: () => void,
    user?: User;
    isLoggedIn: Boolean;
    role: string;
}

export const AuthContext = React.createContext<AuthenticationContextInterface>({ isLoggedIn: false, role: '' });

interface Props {
    children?: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children, ...props }) => {
    const [user, setUser] = useState<User>({
        name: "",
        age: 0,
        email: ""
    });
    const [role, setRole] = useState<string>("patient");
    const [loginStatus, setLoginStatus] = useState<Boolean>(false);
    const [error, setError] = useState('');

    const login = (user: User, token: string, role: string) => {
        setUser(user);
        setLoginStatus(true);
        setRole(role);
        window.localStorage.setItem('user_token', token);
        window.localStorage.setItem('user', JSON.stringify(user));
        window.localStorage.setItem('role', role);
    }
    const logout = () => {
        setLoginStatus(false);
        setUser({
            name: "",
            age: 0,
            email: ""
        });
        window.localStorage.removeItem('user_token');
        window.localStorage.removeItem('user');
        window.localStorage.setItem('role', '');
    }
    useEffect(() => {
        let token = window.localStorage.getItem('user_token');
        let role = window.localStorage.getItem('role');
        let user_store = window.localStorage.getItem('user');
        if (token && user_store && role) {
            let user = JSON.parse(user_store);
            setUser(user);
            setLoginStatus(true);
            setRole(role);
        }
    }, []);
    return (<AuthContext.Provider value={{ isLoggedIn: loginStatus, login, logout, user, role }}>{children}</AuthContext.Provider>)
}
export const AuthConsumer = AuthContext.Consumer