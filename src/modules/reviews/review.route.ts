import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { reviewController } from './review.controller';


const router = express.Router();

router.post(
    "/",
    auth(UserRole.CUSTOMER),
    reviewController.createReview
);

router.patch(
    "/:reviewId",
    auth(UserRole.ADMIN),
    reviewController.updateReviewStatus
);

router.delete(
    "/:reviewId",
    auth(UserRole.ADMIN),
    reviewController.deleteReview
);


export const reviewRouter: Router = router;