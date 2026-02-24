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
        const result = await medicineService.getAllMedicineInService({ search: searchString, page, limit, skip, finalSortBy, sortOrder, sellerId, categoryId });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: "Medicine retrival failed",
            details: err instanceof Error ? err.message : err
        })
    }
}

const getMyMedicine = async (req: Request, res: Response) => {
    try {

        const currentSellerId = req.user?.id;

        if (!currentSellerId) {
            throw new Error("You must be logged in to view your added medicines.");
        }

        //Search
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;

        //Sort
        const { page, limit, skip, sortBy, sortOrder } = paginationAndSortingHelper(req.query);
        const allowedSortFields = ['name', 'price', 'manufacturer', 'stock', 'createdAt'];
        const finalSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : "createdAt";

        //Filter by Category
        const categoryId = req.query.categoryId as string | undefined;

        //Main Logic
        const result = await medicineService.getAllMedicineInService({ search: searchString, page, limit, skip, finalSortBy, sortOrder, sellerId: currentSellerId, categoryId });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({
            error: "Medicine retrival failed",
            details: err instanceof Error ? err.message : err
        })
    }
}

const getMedicineById = async (req: Request, res: Response) => {
    try {
        const { medId } = req.params;

        if (!medId) {
            throw new Error("Medicine Id is required!");
        }

        const result = await medicineService.getMedicineByIdInService(medId as string);
        res.status(200).json({
            success: true,
            message: "Medicine retrieved successfully!",
            data: result
        });
    }
    catch (err) {
        res.status(400).json({
            error: "Medicine retrive by Id failed",
            details: err
        })
    }
}

const updateMedicine = async (req: Request, res: Response) => {
    try {
        const { medId } = req.params;
        const currentSellerId = req.user?.id;
        const currentSellerRole = req.user?.role;

        if (!currentSellerId || !currentSellerRole) {
            throw new Error("You must be logged in to update medicine.");
        }

        const result = await medicineService.updateMedicineInService(medId as string, currentSellerId, currentSellerRole, req.body);

        res.status(200).json({
            success: true,
            message: "Medicine updated successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Medicine update failed.",
            details: error
        });
    }
};

const deleteMedicine = async (req: Request, res: Response) => {
    try {
        const { medId } = req.params;
        const currentSellerId = req.user?.id;
        const currentSellerRole = req.user?.role;

        if (!currentSellerId || !currentSellerRole) {
            throw new Error("You must be logged in to delete medicine.");
        }

        const result = await medicineService.deleteMedicineInService(medId as string, currentSellerId, currentSellerRole);

        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully!",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Medicine deletion failed.",
            details: error.message || error
        });
    }
};


export const medicineController = {
    createMedicine,
    getAllMedicine,
    getMyMedicine,
    getMedicineById,
    updateMedicine,
    deleteMedicine
}