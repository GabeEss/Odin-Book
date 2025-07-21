import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GuestProvider } from './features/guest/guestid-context';
import { GuestInitializeProvider } from './features/guest/guest-initialize-context';
import { SocketProvider } from './features/sockets/socket-context';
import { UserProvider } from './features/user/context/user-context';
import { NotificationsProvider } from './features/header/notifications/notifications-context';
import { useAuth0 } from '@auth0/auth0-react';
import { default as PR } from './features/auth/protected-route';
import { QueryClient, QueryClientProvider } from 'react-query';

import LoginPage from './pages/login';
import LoadingPage from './pages/loading';
import ErrorPage from './pages/error';

const HomePage = lazy(() => import('./pages/home'));
const SignUpPage = lazy(() => import('./pages/sign-up'));
const UserPage = lazy(() => import('./pages/user'));
const FriendsPage = lazy(() => import('./pages/friends'));
const MessagingPage = lazy(() => import('./pages/messages'));
const EventPage = lazy(() => import('./pages/event'));
const EventsPage = lazy(() => import('./pages/events'));

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
            <SocketProvider>
              <UserProvider>
                <NotificationsProvider>
                  <Suspense fallback={<LoadingPage/>}>
                    <Routes>
                      <Route path="/" element={<LoginPage/>}/>
                      <Route path='/loading' element={<LoadingPage/>}/>
                      <Route path='/error' element={<ErrorPage/>}/>
                      <Route path='/home' element={<PR><HomePage/></PR>}/>
                      <Route path='/signup' element={<PR><SignUpPage/></PR>}/>
                      <Route path='/user/:id' element={<PR><UserPage/></PR>}/>
                      <Route path='/event/:id' element={<PR><EventPage/></PR>}/>
                      <Route path='/events' element={<PR><EventsPage/></PR>}/>
                      <Route path='/friends' element={<PR><FriendsPage/></PR>}/>
                      <Route path='/messages/:id' element={<PR><MessagingPage/></PR>}/>
                    </Routes>
                  </Suspense>
                </NotificationsProvider>
              </UserProvider>
            </SocketProvider>
          </GuestInitializeProvider>
        </GuestProvider>
      </QueryClientProvider>
    </Router>
  )
}

export default App;