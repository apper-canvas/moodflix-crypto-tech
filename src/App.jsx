import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './Layout'
import { routes, routeArray } from './config/routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-accent">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/discover" replace />} />
            {routeArray.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<routes.notFound.component />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-card border border-secondary"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  )
}

export default App