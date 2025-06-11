import dotenv from "dotenv";

dotenv.config();

// TODO: GEV BRAT DLYA TEBYA
export const services = {
  authService: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  gameService: process.env.GAME_SERVICE_URL || "http://localhost:3002",
  userService: process.env.USER_SERVICE_URL || "http://localhost:3003",
  pongService: process.env.PONG_SERVICE_URL || "http://localhost:3004",
};
