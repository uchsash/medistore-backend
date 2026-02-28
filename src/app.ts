import express, { Application } from "express"
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import router from "./routes";

const app: Application = express();

app.set('trust proxy', 1);

// app.use(cors({
//     origin: process.env.APP_URL || "http://localhost:3000",
//     credentials: true
// }))

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // later your frontend vercel url
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());

app.use("/api", router);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Hello, Medistore!");
})

export default app;