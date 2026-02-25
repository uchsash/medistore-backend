import { Router } from "express";
import { medicineRouter } from "../modules/medicine/medicine.router";
import { categoryRouter } from "../modules/category/category.router";
import { orderRouter } from "../modules/order/order.router";
import { userRouter } from "../modules/user/user.router";
import { reviewRouter } from "../modules/reviews/review.route";

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
    {
        path: "/users",
        route: userRouter,
    },
    {
        path: "/reviews",
        route: reviewRouter,
    },
];

routerManager.forEach((r) => router.use(r.path, r.route));

export default router;