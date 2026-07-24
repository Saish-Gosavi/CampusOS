import jwt from "jsonwebtoken";
import { env } from "./env.js";

export const jwtConfig = {
  generateToken: (payload) => {
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  },
  verifyToken: (token) => {
    return jwt.verify(token, env.jwtSecret);
  },
  verifyRefreshToken: (token) => {
    return jwt.verify(token, env.jwtRefreshSecret);
  },
};
