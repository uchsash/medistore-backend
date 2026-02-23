import { Request, Response } from "express";
import { medicineService } from "./medicine.service";


const createMedicine = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized"
            })
        }
        const result = await medicineService.createMedicineInService(req.body, user.id);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Medicine creation failed",
            details: error instanceof Error ? error.message : error
        })
    }
}

export const medicineController = {
    createMedicine,

}