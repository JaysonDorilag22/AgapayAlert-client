import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/redux/store';
import serverConfig from '@/config/serverConfig';

let socket = null;
const SOCKET_URL = serverConfig.socketURL;

const extractTokenFromCookie = (cookieString) => {
  if (!cookieString) return null;
  const tokenMatch = cookieString.match(/token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
};


export const initializeSocket = async (cookieHeader) => {
  try {
    if (socket?.connected) {
      console.log('Socket already connected');
      return socket;
    }

    const token = extractTokenFromCookie(cookieHeader);
    if (!token) {
      console.log('No auth token found in cookie');
      return null;
    }

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      withCredentials: true,
      extraHeaders: {
        Cookie: `token=${token}`
      }
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
      joinRooms();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    return socket;

  } catch (error) {
    console.error('Socket initialization error:', error);
    return null;
  }
};