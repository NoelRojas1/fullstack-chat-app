import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => {
    return {
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: true,
        onlineUsers: [],
        socket: null,


        checkAuth: async () => {
            try {
                const response = await axiosInstance.get("/auth/check");
                set({authUser: response.data});
                get().connectToSocket();
            } catch(error) {
                console.log("Error checking auth", error);
                set({authUser: null});
            } finally {
                set({isCheckingAuth: false});
            }
        },
        signup: async (data) => {
            set({isSigningUp: true});
            try{
                const response = await axiosInstance.post("/auth/signup", data);
                set({authUser: response.data});
                toast.success("Account created successfully");
                get().connectToSocket();
            } catch(error) {
                toast.error(error.response.data.message);
            } finally {
                set({isSigningUp: false});
            }
        },
        login: async (data) => {
            set({isLoggingIn: true});
            try {
                const response = await axiosInstance.post("/auth/login", data);
                set({authUser: response.data});
                toast.success("Logged in successfully");
                get().connectToSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                set({isLoggingIn: false});
            }
        },
        logout: async () => {
            try {
                await axiosInstance.post("/auth/logout");
                set({authUser: null});
                toast.success("Logged out successfully");
                get().disconnectFromSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        },
        updateProfile: async (data) => {
            set({isUpdatingProfile: true});
            try {
                const response = await axiosInstance.put("/users/update-profile", data);
                set({authUser: response.data});
                toast.success("Profile updated successfully");
            }
            catch (error) {
                console.log("Error updating profile", error);
                toast.error(error.response.data.message);
            } finally {
                set({isUpdatingProfile: false});
            }
        },
        connectToSocket: () => {
            const { authUser, socket } = get();

            if(!authUser || socket?.connected) {
                return;
            }

            const clientSocket = io(BASE_URL, {
                query: {
                    userId: authUser._id
                }
            });
            clientSocket.connect();
            set({socket: clientSocket});

            // get online users
            clientSocket.on("getOnlineUsers", (userIds) => {
                set({onlineUsers: userIds});
            })
        },
        disconnectFromSocket: () => {
            const { socket } = get();
            if(socket?.connected) {
                socket.disconnect();
            }
        },
    }
});