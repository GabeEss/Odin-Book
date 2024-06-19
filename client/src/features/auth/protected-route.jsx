import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useContext } from 'react';
import { GuestInitializeContext } from '../guest/guest-initialize-context';
import LoadingPage from '../../pages/loading';
import axios from 'axios';

// Checks backend and auth0 on protected routes during page load
const ProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated } = useAuth0();
    const location = useLocation();
    const [isConnected, setIsConnected] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(true);
    const { guestInit, setGuestInit } = useContext(GuestInitializeContext);

    // Check backend connection when loading a new page.
    // Note: this will not check mongo.
    useEffect(() => {
      const checkConnection = async () => {
          try {
            //   console.log('Checking connection to backend.');
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/health`);
              setIsConnected(response.status === 200);
          } catch (error) {
              console.error('Failed to connect to backend:', error);
              setGuestInit(false);
              setIsConnected(false);
          } finally {
              setIsCheckingConnection(false);
            //   console.log("Connection check complete.");
          }
      };

      checkConnection();
    }, [location]);

    // Make sure guestInit is set to false if user is authenticated
    useEffect(() => {
        if (isAuthenticated && guestInit === true) {
            setGuestInit(false);
            // Clear the guestId cookie, which is set in the backend
            Cookies.remove('guestId');
        }
    }, [isAuthenticated]);

    // If checking backend connection or auth0, display loading page
    if (isCheckingConnection || isLoading) {
        return <LoadingPage />;
    }

    // If not connected to backend, redirect to error page and allow user logout from auth0
    if(!isConnected && !isCheckingConnection) {
        return <Navigate to="/error" replace state={{ from: location }} />;
    }
    
    // If not authenticated by auth0 or not a guest user, redirect to login page
    if (!isAuthenticated && guestInit === false) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;