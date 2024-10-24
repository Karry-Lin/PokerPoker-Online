import {create} from 'zustand';
import Cookies from 'js-cookie';
import {useEffect} from "react";

export const useUserStore = create((set, get) => ({
    userId: "",
    isLogin: () => {
        return get().userId !== "";
    },
    login: (userId) => {
        set({userId});
        Cookies.set('userId', userId, {expires: 7});
    },
    logout: () => {
        set({userId: ""});
        Cookies.remove('userId');
    },
}));

export const useSyncUserFromCookies = () => {
    const setUser = useUserStore((state) => state.login);
    useEffect(() => {
        const userId = Cookies.get('userId') || "";
        setUser(userId);
    }, []);
};
