import {useEffect} from 'react'
import Navbar from "./components/Navbar.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";

import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {useAuthStore} from "./store/useAuthStore.js";
import {useThemeStore} from "./store/useThemeStore.js";




function App() {
     const { theme } = useThemeStore();
     const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

     useEffect(() => {
         checkAuth();
     }, [checkAuth]);

     if(isCheckingAuth && !authUser) {
         return (
             <div className="flex items-center justify-center h-screen">
                 <Loader className="size-10 animate-spin" />
             </div>
         )
     }

      return (
          <div data-theme={theme}>

                <Navbar />

                <Routes>
                    <Route path="/" element={!authUser ? <LandingPage /> : <Navigate to="/chat" />} />
                    <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
                    <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={authUser ?  <ProfilePage /> : <Navigate to="/login" />} />
                </Routes>


                <Toaster />

          </div>
      )
}

export default App
