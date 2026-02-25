import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { userController } from './user.controller';

const router = express.Router();

router.get(
    "/me",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    userController.getMyProfile
);

router.patch(
    "/me",
    auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN),
    userController.updateMyProfile
);

// Admin Routes
router.get(
    "/admin/users",
    auth(UserRole.ADMIN),
    userController.getAllUsers
);

router.patch(
    "/admin/users/:id",
    auth(UserRole.ADMIN),
    userController.updateUserStatus
);



export const userRouter: Router = router;