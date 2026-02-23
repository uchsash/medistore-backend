import { prisma } from "../../lib/prisma";


const createCategoryInService = async (name: string) => {
    const result = await prisma.category.create({
        data: {
            name
        }
    });

    return result;
}

export const categoryService = {
    createCategoryInService,
}