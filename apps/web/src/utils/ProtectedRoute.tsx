import { Navigate } from 'react-router-dom';
import { useSocket } from '../utils/ChatContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { username } = useSocket();

  if (!username) return <Navigate to="/" />;

  return children;
}