import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import ChatPage from './pages/chat'
import { SocketProvider } from './utils/ChatContext'
import ProtectedRoute from './utils/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/chat' element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
            } />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App
