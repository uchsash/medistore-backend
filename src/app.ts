import express, { Application } from "express"
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { medicineRouter } from "./modules/medicine/medicine.router";
import { categoryRouter } from "./modules/category/category.router";
import router from "./routes";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true
}))

app.use(express.json());

app.use("/api", router);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Hello, Medistore!");
})

export default app;