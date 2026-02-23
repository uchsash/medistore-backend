import { Request, Response } from "express";
import { categoryService } from "./category.service";


const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.createCategoryInService();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: "Category creation failed",
            details: error instanceof Error ? error.message : error
        })
    }
}

export const categoryController = {
    createCategory,

}