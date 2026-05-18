import { io } from "socket.io-client";

const socket = io("http://localhost:8499", {
    transports: ["websocket"],
});

export { socket };
