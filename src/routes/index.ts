import { Router } from "express";
import { medicineRouter } from "../modules/medicine/medicine.router";
import { categoryRouter } from "../modules/category/category.router";

const router = Router();

const routerManager = [
    {
        path: "/medicines",
        route: medicineRouter,
    },
    {
        path: "/categories",
        route: categoryRouter,
    }
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;