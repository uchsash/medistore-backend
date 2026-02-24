import { prisma } from "../../lib/prisma";


const createCategoryInService = async (name: string) => {
    const result = await prisma.category.create({
        data: {
            name
        }
    });

    return result;
}

const getAllCategoryInService = async (sortBy: string, sortOrder: string) => {
    const result = await prisma.category.findMany({
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    medicines: true
                }
            }
        }
    });

    return result;
}

const getCategoryByIdInService = async (catId: string, sortBy: string, sortOrder: string) => {
    const result = await prisma.category.findUniqueOrThrow({
        where: {
            id: catId
        },
        include: {
            medicines: {
                orderBy: {
                    [sortBy]: sortOrder
                }
            },
            _count: {
                select: {
                    medicines: true
                }
            }
        }
    });

    return result;
}

const updateCategoryInService = async (catId: string, newName: string) => {
    return await prisma.category.update({
        where: {
            id: catId
        },
        data: {
            name: newName
        }
    });
};


const deleteCategoryInService = async (catId: string) => {
    await prisma.category.findUniqueOrThrow({
        where: {
            id: catId
        }
    });

    return await prisma.category.delete({
        where: {
             id: catId
        }
    });
};

export const categoryService = {
    createCategoryInService,
    getAllCategoryInService,
    getCategoryByIdInService,
    updateCategoryInService,
    deleteCategoryInService
}