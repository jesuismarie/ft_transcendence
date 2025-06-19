import dotenv from "dotenv";

dotenv.config();

export const services = {
  authService: "https://auth-service:5000",
  gameService: "https://game-service:5001",
  userService: "https://user-service:5002",
  pongService: "https://pong-service:5005",
};
