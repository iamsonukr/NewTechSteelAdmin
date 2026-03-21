import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/AuthPages/SignIn";
import { useEffect } from "react";
import SignUp from "./pages/AuthPages/SignUp";
import { ToastContainer } from 'react-toastify';
import ResetPassword from "./pages/AuthPages/ResetPassword";
import AppRouter from "./routes/AppRouter";


export default function App() {
  const { AccessToken, setAuth, UserRole } = useAuth();

  useEffect(() => {
    console.log(UserRole)
  }, [UserRole])


  // If no access token, show SignIn page
  if (!AccessToken && !UserRole  ) {
    return (
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<SignIn />} /> {/* Redirect all routes to signin when not authenticated */}
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  }

  return (
    <>
      <ToastContainer style={{ zIndex: 9999999 }} />
      <AppRouter/>
    </>
  );
}