import express, { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { medicineController } from './medicine.controller';

const router = express.Router();


router.post(
    "/",
    auth(UserRole.SELLER),
    medicineController.createMedicine
);

router.get(
    "/",
    medicineController.getAllMedicine
);

router.get(
    "/my-medicine",
    auth(UserRole.SELLER),
    medicineController.getMyMedicine
);

router.get(
    "/:medId",
    medicineController.getMedicineById
);

router.patch(
    "/:medId",
    auth(UserRole.SELLER, UserRole.ADMIN),
    medicineController.updateMedicine
);

router.delete(
    "/:medId",
    auth(UserRole.SELLER, UserRole.ADMIN),
    medicineController.deleteMedicine
);

export const medicineRouter: Router = router;