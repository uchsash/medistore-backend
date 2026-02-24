import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId){
            throw new Error("Unauthorized")
        };

        const result = await orderService.createOrderInService(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Could not place order",
            details: error.message || error
        });
    }
};

const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized.");
        }

        const result = await orderService.getMyOrdersInService(userId);

        res.status(200).json({
            success: true,
            message: "Order history retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Order retrive failed.",
            details: error.message || error
        });
    }
};

const getOrderById = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId || !userRole) {
            throw new Error("Authentication required.");
        }

        const result = await orderService.getOrderByIdInService(orderId as string, userId, userRole);

        res.status(200).json({
            success: true,
            message: "Order details retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Order details retrieve failed.",
            details: error.message || error
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById
}