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

export const medicineRouter: Router = router;