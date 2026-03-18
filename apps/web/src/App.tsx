import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import ChatPage from './pages/chat'
import { SocketProvider } from './utils/SocketContext'
import ProtectedRoute from './utils/ProtectedRoute'
import { ChatProvider } from './utils/ChatContext'

function App() {

  return (
    <BrowserRouter>
      <SocketProvider>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/chat' element={
              <ProtectedRoute>
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              </ProtectedRoute>
              } />
          </Routes>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App
