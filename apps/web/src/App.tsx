import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import ChatPage from './pages/chat'
import { SocketProvider } from './utils/SocketContext'
import ProtectedRoute from './utils/ProtectedRoute'
import { ChatProvider } from './utils/ChatContext'
import { ThemeProvider, createTheme } from '@mui/material'
import { defaultTheme } from './ui/themes/default'

const theme = createTheme(defaultTheme);

function App() {

  return (
    <BrowserRouter>
      <SocketProvider>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App
