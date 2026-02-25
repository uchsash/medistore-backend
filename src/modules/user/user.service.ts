import { User } from "better-auth/types";
import { prisma } from "../../lib/prisma";

const getMyProfileInService = async (userId: string) => {
    return await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

const updateMyProfileInService = async (userId: string, data: Partial<User>) => {

    const { role, status, email, ...updateData } = data as any;

    return await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });
};

const getAllUsersInService = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateUserStatusInService = async (targetUserId: string, status: "ACTIVE" | "BANNED") => {
    return await prisma.user.update({
        where: { id: targetUserId },
        data: { status }
    });
};

export const userService = {
    getMyProfileInService,
    updateMyProfileInService,
    getAllUsersInService,
    updateUserStatusInService
}