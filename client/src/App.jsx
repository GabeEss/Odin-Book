import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GuestProvider } from './features/guest/guestid-context';
import { GuestInitializeProvider } from './features/guest/guest-initialize-context';
import { NotificationsProvider } from './features/header/notifications/notifications-context';
import { useAuth0 } from '@auth0/auth0-react';
import { default as PR } from './features/auth/protected-route';
import { QueryClient, QueryClientProvider } from 'react-query';

import LoginPage from './pages/login';
import HomePage from './pages/home';
import SignUpPage from './pages/sign-up';
import UserPage from './pages/user';
import FriendsPage from './pages/friends';
import MessagingPage from './pages/messages';
import EventPage from './pages/event';
import EventsPage from './pages/events';
import LoadingPage from './pages/loading';
import ErrorPage from './pages/error';

const queryClient = new QueryClient();

function App() {
  const { isLoading } = useAuth0();

  if(isLoading) {
    return <LoadingPage/>
  }

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <GuestProvider>
          <GuestInitializeProvider>
            <NotificationsProvider>
              <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path='/error' element={<ErrorPage/>}/>
                <Route path='/home' element={<PR><HomePage/></PR>}/>
                <Route path='/signup' element={<PR><SignUpPage/></PR>}/>
                <Route path='/user/:id' element={<PR><UserPage/></PR>}/>
                <Route path='/event/:id' element={<PR><EventPage/></PR>}/>
                <Route path='/events' element={<PR><EventsPage/></PR>}/>
                <Route path='/friends' element={<PR><FriendsPage/></PR>}/>
                <Route path='/messages/:id' element={<PR><MessagingPage/></PR>}/>
              </Routes>
            </NotificationsProvider>
          </GuestInitializeProvider>
        </GuestProvider>
      </QueryClientProvider>
    </Router>
  )
}

export default App;