import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // <-- Make sure this line is present and uncommented
import { AuthProvider } from './context/AuthContext.jsx'
import { PetProvider } from './context/PetContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </AuthProvider>
  </React.StrictMode>,
)
