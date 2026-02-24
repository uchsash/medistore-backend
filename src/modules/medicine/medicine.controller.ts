import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import paginationAndSortingHelper from "../../helpers/paginationSortingHelper";


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

const getAllMedicine = async (req: Request, res: Response) => {
    try {
        //Search
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;

        //Sort
        const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(req.query);
        const allowedSortFields = ['name', 'price', 'manufacturer', 'stock', 'createdAt'];
        const finalSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : "createdAt";

        //Filter by Seller
        const sellerId = req.query.sellerId as string | undefined;

        //Filter by Category
        const categoryId = req.query.categoryId as string | undefined;

        //Main Logic
        const result = await medicineService.getAllMedicineInService({search: searchString, page, limit, skip, finalSortBy, sortOrder, sellerId, categoryId});
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: "Medicine retrival failed",
            details: err instanceof Error ? err.message : err
        })
    }
}

export const medicineController = {
    createMedicine,
    getAllMedicine

}