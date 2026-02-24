import { Router } from "express";
import { medicineRouter } from "../modules/medicine/medicine.router";
import { categoryRouter } from "../modules/category/category.router";
import { orderRouter } from "../modules/order/order.router";

const router = Router();

const routerManager = [
    {
        path: "/medicines",
        route: medicineRouter,
    },
    {
        path: "/categories",
        route: categoryRouter,
    },
    {
        path: "/orders",
        route: orderRouter,
    },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;