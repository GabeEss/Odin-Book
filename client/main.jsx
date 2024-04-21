import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './src/App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import './src/styles/index.css'

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
      redirectUri={window.location.origin}
      // Commenting this out will generate an opaque token rather than a JWT
      authorizationParams={{
        audience: import.meta.env.VITE_AUTH_AUDIENCE,
        scope: "current_user openid profile email",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)