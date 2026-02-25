import express, { Router } from 'express';
import { orderController } from './order.controller';
import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();

router.post(
    "/",
    auth(UserRole.CUSTOMER),
    orderController.createOrder
);

router.get(
    "/my-orders",
    auth(UserRole.CUSTOMER),
    orderController.getMyOrders
);

router.get(
    "/manage",
    auth(UserRole.SELLER),
    orderController.getSellerOrders
);

//---
//Unchecked Route
router.get(
    "/admin/orders",
    auth(UserRole.ADMIN),
    orderController.getAllOrdersForAdmin
);
//---

router.get(
    "/:orderId",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    orderController.getOrderById
);

//---
//Unchecked Route
router.patch(
    "/:orderId",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    orderController.updateOrderStatus
);
//---

export const orderRouter: Router = router;