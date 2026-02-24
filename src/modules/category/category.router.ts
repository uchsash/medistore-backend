import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { categoryController } from './category.controller';


const router = express.Router();


router.post(
    "/",
    auth(UserRole.ADMIN),
    categoryController.createCategory
);

router.get(
    "/",
    categoryController.getAllCategory
)

router.get(
    "/:catId",
    categoryController.getCategoryById
)

router.patch(
    "/:catId",
    auth(UserRole.ADMIN),
    categoryController.updateCategory
)

router.delete(
    "/:catId",
    auth(UserRole.ADMIN),
    categoryController.deleteCategory

)

export const categoryRouter: Router = router;