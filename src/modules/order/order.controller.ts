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

const getSellerOrders = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user?.id;
        if (!sellerId) throw new Error("Unauthorized access.");

        const result = await orderService.getSellerOrdersInService(sellerId);

        res.status(200).json({
            success: true,
            message: "Seller orders retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch incoming orders.",
            details: error.message
        });
    }
};

const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId || !userRole){
            throw new Error("Unauthorized");
        }
        if(!orderId){
            throw new Error("Order doesn't exists.");
        }

        const result = await orderService.updateOrderStatusInService(orderId as string, status, userId, userRole);

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status} successfully!`,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Order status update failed.",
            details: error.message
        });
    }
};

const getAllOrdersForAdmin = async (req: Request, res: Response) => {
    try {
        const result = await orderService.getAllOrdersForAdminInService();

        res.status(200).json({
            success: true,
            message: "All the orders retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch all the orders.",
            details: error.message
        });
    }
};

export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    getSellerOrders,
    updateOrderStatus,
    getAllOrdersForAdmin
}