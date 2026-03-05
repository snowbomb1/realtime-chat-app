import { createContext, useContext, useRef, useState } from "react";
import { Socket } from 'socket.io-client';

interface SocketContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  socketRef: React.RefObject<Socket | null>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [username, setUsername] = useState<string>("");
    const socketRef = useRef<Socket | null>(null);

    return (
        <SocketContext.Provider value={{ username, setUsername, socketRef }}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
}