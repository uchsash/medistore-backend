import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createMedicineInService = async (data: Omit<Medicine, "id" | "createdAt" | "updatedAt">, userId: string) => {
    const result = await prisma.medicine.create({
        data: {
            ...data,
            sellerId: userId
        }
    });

    return result;
}

const getAllMedicineInService = async ({
    search,
    page,
    limit,
    skip,
    finalSortBy,
    sortOrder,
    sellerId,
    categoryId
}: {
    search: string | undefined,
    page: number,
    limit: number,
    skip: number,
    finalSortBy: string,
    sortOrder: string,
    sellerId: string | undefined,
    categoryId: string | undefined
}) => {

    const andConditions: MedicineWhereInput[] = [];
    const searchNumber = parseFloat(search as string);
    const isNumber = !isNaN(searchNumber);

    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                {
                    manufacturer: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },
                ...(isNumber ? [
                    { price: { equals: searchNumber } },
                    { stock: { equals: Math.floor(searchNumber) } }
                ] : [])
            ]
        })
    }

    if (sellerId) {
        andConditions.push({
            sellerId
        })
    }

    if (categoryId) {
        andConditions.push({
            categoryId
        })
    }

    const result = await prisma.medicine.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [finalSortBy]: sortOrder
        },
        include: {
            category: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            },
            reviews: {
                select: {
                    rating: true
                }
            }
        }
    });

    const total = await prisma.medicine.count({
        where: {
            AND: andConditions
        }
    });
    
    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };

}

const getMedicineByIdInService = async(medId: string) => {
    return await prisma.medicine.findUniqueOrThrow({
        where: {
            id: medId
        },
        include: {
            category: true,
            reviews: {
                where: {
                    status: 'PUBLISHED'
                },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    });

}

const updateMedicineInService = async (medId: string, sellerId: string, sellerRole: string, updateData: any) => {
    
    const medicine = await prisma.medicine.findUniqueOrThrow({
        where: {
            id: medId
        }
    });

    if (sellerRole !== 'ADMIN' && medicine.sellerId !== sellerId) {
        throw new Error("You do not have permission to update this medicine.");
    }

    if (updateData.categoryId) {
       await prisma.category.findUniqueOrThrow({
            where: {
                id: updateData.categoryId
            }
        });
    }

    const result = await prisma.medicine.update({
        where: {
             id: medId 
        },
        data: updateData,
        include: {
            category: true
        }
    });

    return result;
};

const deleteMedicineInService = async (medId: string, sellerId: string, sellerRole: string) => {

    const medicine = await prisma.medicine.findUniqueOrThrow({
        where: {
            id: medId
        }
    });

    if (sellerRole !== 'ADMIN' && medicine.sellerId !== sellerId) {
        throw new Error("You do not have permission to delete this medicine.");
    }

    const result = await prisma.medicine.delete({
        where: {
             id: medId 
        }
    });

    return result;
};


export const medicineService = {
    createMedicineInService,
    getAllMedicineInService,
    getMedicineByIdInService,
    updateMedicineInService,
    deleteMedicineInService
}