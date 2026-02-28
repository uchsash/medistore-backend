import { Request, Response } from "express";
import { reviewServices } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const result = await reviewServices.createReviewInService(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Review posted successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Review posting failed",
            details: error.message
        });
    }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await reviewServices.getAllReviewsInService();
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Review retrieval failed",
      details: error.message,
    });
  }
};

const updateReviewStatus = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { newStatus } = req.body;

        const result = await reviewServices.updateReviewStatusInService(reviewId as string, newStatus);
        res.status(200).json({
            success: true,
            message: "Review update successful!",
            data: result
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Review update failed",
            details: error.message
        });
    }
};

const deleteReview = async (req: Request, res: Response) => {
    try {
        const { reviewId } = req.params;
        
        const result = await reviewServices.deleteReviewInService(reviewId as string);
        res.status(200).json({
            success: true,
            message: "Review deleted successfully!",
            data: result
        });
    }
    catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Review deletion failed",
            details: error.message
        });
    }
}

export const reviewController = {
    createReview,
    updateReviewStatus,
    deleteReview,
    getAllReviews

}