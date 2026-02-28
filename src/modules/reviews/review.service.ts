import { prisma } from "../../lib/prisma";


const createReviewInService = async (userId: string, payload: { medicineId: string, rating: number, comment: string }) => {

    const deliveredOrder = await prisma.order.findFirst({
        where: {
            customerId: userId,
            status: 'DELIVERED',
            items: {
                some: {
                    medicineId: payload.medicineId
                }
            }
        }
    });

    if (!deliveredOrder) {
        throw new Error("You can only review medicines that you have purchased.");
    }

    return await prisma.review.create({
        data: {
            userId,
            medicineId: payload.medicineId,
            rating: payload.rating,
            comment: payload.comment
        }
    });
};

const getAllReviewsInService = async () => {
    return await prisma.review.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            medicine: {
                select: {
                    id: true,
                    name: true
                }
            },
        },
    });
};


const updateReviewStatusInService = async (reviewId: string, newStatus: "PUBLISHED" | "UNPUBLISHED") => {
    const existingReview = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId
        }
    });

    if (existingReview.status === newStatus) {
        throw new Error(`Review status is already ${newStatus}.`);
    }

    return await prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            status: newStatus
        }
    });
};


const deleteReviewInService = async (reviewId: string) => {
    return await prisma.review.delete({
        where: {
            id: reviewId
        }
    });
};

export const reviewServices = {
    createReviewInService,
    updateReviewStatusInService,
    deleteReviewInService,
    getAllReviewsInService
}