import { Request, Response } from "express";
import { userService } from "./user.service";

const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId){
            throw new Error("Unauthorized");
        }

        const result = await userService.getMyProfileInService(userId);

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            details: error.message
        });
    }
};

const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const result = await userService.updateMyProfileInService(userId, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to update profile",
            details: error.message
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsersInService();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch users",
            details: error.message
        });
    }
};

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) throw new Error("Status is required");

        const result = await userService.updateUserStatusInService(id as string, status);

        res.status(200).json({
            success: true,
            message: `User status updated to ${status} successfully!`,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to update user status",
            details: error.message
        });
    }
};

export const userController = {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    updateUserStatus
    

}