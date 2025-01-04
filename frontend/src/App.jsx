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
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import VerifyEmailNotificationPage from "./pages/VerifyEmailNotificationPage.jsx";
import {useAuthStore} from "./store/useAuthStore.js";
import {useThemeStore} from "./store/useThemeStore.js";

const ProtectedHomePage = withAuth(HomePage, "/verify-notification");
const ProtectedProfilePage = withAuth(ProfilePage, "/login");
const LandingPageWithAuthRedirect = withRedirection(LandingPage, "/chat");

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
                    <Route path="/" element={<LandingPageWithAuthRedirect user={authUser} />} />login
                    <Route path="/chat" element={<ProtectedHomePage user={authUser} />} />
                    <Route path="/profile" element={<ProtectedProfilePage user={authUser} />} />
                    <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
                    <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/verify" element={<VerifyEmailPage />} />
                    <Route path="/verify-notification" element={<VerifyEmailNotificationPage />} />
                </Routes>

                <Toaster />

          </div>
      )
}

function withRedirection(Component, to) {
    return ({user, ...props}) => {
        if(!user) {
            return <Component {...props} />
        }
        return <Navigate to={to} />
    }
}

function withAuth(Component, to) {
    return ({user, ...props}) => {
        if(!user) {
            return <Navigate to="/login" />
        }

        if(!user.verified) {
            return <Navigate to={to} />
        }

        return <Component {...props} />
    }
}

export default App
