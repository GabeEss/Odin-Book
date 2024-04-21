import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GuestProvider } from './features/guest/guestid-context';
import { GuestInitializeProvider } from './features/guest/guest-initialize-context';
import { useAuth0 } from '@auth0/auth0-react';
import { default as PR } from './features/auth/protected-route';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import SignUpPage from './pages/sign-up';
import UserPage from './pages/user';
import EventsPage from './pages/events';
import LoadingPage from './pages/loading';
import ErrorPage from './pages/error';

function App() {
  const { isLoading } = useAuth0();

  if(isLoading) {
    return <LoadingPage/>
  }

  // PR stands for Protected Route
  return (
    <Router>
        <GuestProvider>
          <GuestInitializeProvider>
            <Routes>
              <Route path="/" element={<LoginPage/>}/>
              <Route path='/error' element={<ErrorPage/>}/>
              <Route path='/home' element={<PR><HomePage/></PR>}/>
              <Route path='/signup' element={<PR><SignUpPage/></PR>}/>
              <Route path='/user/:id' element={<PR><UserPage/></PR>}/>
              <Route path='/events' element={<PR><EventsPage/></PR>}/>
            </Routes>
          </GuestInitializeProvider>
        </GuestProvider>
    </Router>
  )
}

export default App;