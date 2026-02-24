import { Request, Response } from "express";
import { categoryService } from "./category.service";
import paginationAndSortingHelper from "../../helpers/paginationSortingHelper";


const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.createCategoryInService(req.body.name);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Category creation failed",
            details: error instanceof Error ? error.message : error
        })
    }
}

const getAllCategory = async (req: Request, res: Response) => {
    try {
        const { sortBy, sortOrder } = paginationAndSortingHelper(req.query);

        const allowedSortFields = ['name', 'createdAt'];
        const finalSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : "name";
        
        const result = await categoryService.getAllCategoryInService(finalSortBy, sortOrder);

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Categories fetched unsuccessful."
        })
    }
};

const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { catId } = req.params;
        const { sortBy, sortOrder } = paginationAndSortingHelper(req.query);

        const allowedSortFields = ['name', 'createdAt'];
        const finalSortBy = allowedSortFields.includes(sortBy as string) ? sortBy : "createdAt";

        if (!catId) {
            throw new Error("Category Id is required");
        }

        const result = await categoryService.getCategoryByIdInService(catId as string, finalSortBy, sortOrder);

        res.status(200).json({
            success: true,
            message: "Category Data fetched successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Category fetched unsuccessful."
        })
    }
};

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { catId } = req.params;

        if (!catId) {
            throw new Error("Category Id is required");
        }

        const result = await categoryService.updateCategoryInService(catId as string, req.body.name);

        res.status(200).json({
            success: true,
            message: "Category Data updated successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Category update unsuccessful."
        })
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { catId } = req.params;

        if (!catId) {
            throw new Error("Category Id is required");
        }

        const result = await categoryService.deleteCategoryInService(catId as string);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Category delete failed."
        })
    }
};


export const categoryController = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory

}