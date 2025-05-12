import { io } from 'socket.io-client';
export const socket = io(process.env.REACT_APP_API_SOCKET);

// import io from 'socket.io-client';

// //@ts-ignore
// export const socket = io.connect(process.env.REACT_APP_API_SOCKET);
