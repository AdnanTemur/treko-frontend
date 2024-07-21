import { io } from "socket.io-client";

// Replace the URL with your backend server's URL
const socket = io("http://192.168.1.7:8000/");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

export default socket;
