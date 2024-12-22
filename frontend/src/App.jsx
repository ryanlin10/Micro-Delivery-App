import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/Home';
import User from './pages/user';
import About from './pages/about';
import Register from './pages/register';
import AuthNavbar from './components/authnavbar';
import Marketplace from './pages/marketplace';
import Login from './pages/login';
import Sell from './pages/Sell';
import Thankyou from './pages/thankyou';
import Verify from './pages/verify';
import ProtectedRoute from './components/protectedroute';
import { AuthProvider } from './context/authcontext';
import { useAuth } from './context/authcontext';
import { useEffect } from 'react';
import { VerifiedProvider } from './context/verifiedcontext';
import { useVerified } from './context/verifiedcontext';
import Mydeliveries from './pages/mydeliveries';
import axios from 'axios';
import ActiveDelivery from './pages/active_delivery';
import MyOrders from './pages/my_orders';
import Tracking from './pages/tracking';

function App(){
  return(
    <AuthProvider>
      <VerifiedProvider>
        <AppContent />
      </VerifiedProvider>
    </AuthProvider>
  )
}



function AppContent() {
  
  const { setIsAuth } = useAuth();
  const { setVerified } = useVerified();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setIsAuth(true);
      // Fetch verification status from the API
      axios.get('http://localhost:8000/backend1/verification-status/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        setVerified(response.data.verification_status === 'verified');
      })
      .catch(error => {
        console.error('Error fetching verification status:', error);
      });
    }
  }, [token, setIsAuth, setVerified]);


  return (

        <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/User" element={<ProtectedRoute><><AuthNavbar /><User /></></ProtectedRoute>} />
            <Route path="/About" element={<><Navbar /><About /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />

            {/* Auth Routes */}
            <Route path="/marketplace" element={<ProtectedRoute><><AuthNavbar /><Marketplace /></></ProtectedRoute>} />
            <Route path="/sell" element={<ProtectedRoute><><AuthNavbar /><Sell /></></ProtectedRoute>} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/mydeliveries" element={<ProtectedRoute><><AuthNavbar /><Mydeliveries /></></ProtectedRoute>} />
            <Route path="/active-delivery" element={<ProtectedRoute><><AuthNavbar /><ActiveDelivery /></></ProtectedRoute>} /> {/*Dynamic route for accepting delivery*/}
            <Route path="/myorders" element={<ProtectedRoute><><AuthNavbar /><MyOrders /></></ProtectedRoute>} />
            <Route path="/tracking/:id" element={<Tracking />} />
          </Routes>
        </div>
        </BrowserRouter>

  );
}

export default App;
