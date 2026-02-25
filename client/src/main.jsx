import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
 <Provider store={store}>
   <App />
   <Toaster 
     position="top-right"
     toastOptions={{
       duration: 3000,
       style: {
         background: '#18181b',
         color: '#fff',
         border: '1px solid rgba(255, 255, 255, 0.1)',
       },
       success: {
         iconTheme: {
           primary: '#10b981',
           secondary: '#fff',
         },
       },
       error: {
         iconTheme: {
           primary: '#ef4444',
           secondary: '#fff',
         },
       },
     }}
   />
 </Provider>
  
)
