import {create} from 'zustand';
import Cookies from 'js-cookie';
import {useEffect} from "react";
import {useRouter} from 'next/navigation';

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
    const logoutUser = useUserStore((state) => state.logout);
    const router = useRouter();
    useEffect(() => {
        const currentPath = location.pathname;
        const syncUser = async () => {
            const userId = Cookies.get('userId') || "";
            if (userId) {
                const response = await fetch(`/api/userId?userId=${userId}`);
                if (!response.ok) {
                    logoutUser();
                    if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') {
                        router.push('/login');
                    }
                    throw new Error('userId does not exist');
                }
                const data = await response.json();
                if (data.message) {
                    setUser(userId);
                } else {
                    logoutUser();
                    if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') {
                        router.push('/login');
                    }
                }
            } else {
                logoutUser();
                if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/signup') {
                    router.push('/login');
                }
            }
        };
        syncUser().catch((error) => {
            console.error(error);
            logoutUser();
        });

    }, [setUser, logoutUser, router]);
};
