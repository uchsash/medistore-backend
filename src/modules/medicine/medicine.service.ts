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
    sortOrder: 'asc' | 'desc',
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
            category: true,
            _count: {
                select: {
                    reviews: true
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

export const medicineService = {
    createMedicineInService,
    getAllMedicineInService
}