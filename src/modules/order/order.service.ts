import { prisma } from "../../lib/prisma";

const createOrderInService = async (
    userId: string,
    orderData: { items: { medicineId: string, quantity: number }[], shippingAddress: string }
) => {

    return await prisma.$transaction(async (tx) => {
        let calculatedTotalAmount = 0;
        const orderItems = [];

        for (const item of orderData.items) {

            const medicine = await tx.medicine.findUnique({
                where: {
                    id: item.medicineId
                }
            });

            if (!medicine) {
                throw new Error(`Medicine with Id ${item.medicineId} was not found in our inventory.`);
            }


            if (medicine.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${medicine.name}. Only ${medicine.stock} left.`);
            }

            await tx.medicine.update({
                where: {
                    id: item.medicineId
                },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });

            const itemPrice = medicine.price;
            calculatedTotalAmount = calculatedTotalAmount + (itemPrice * item.quantity);

            orderItems.push({
                medicineId: item.medicineId,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        return await tx.order.create({
            data: {
                customerId: userId,
                totalAmount: calculatedTotalAmount,
                shippingAddress: orderData.shippingAddress,
                status: 'PENDING',
                items: {
                    create: orderItems
                }
            },
            include: {
                items: true
            }
        });
    });
};

const getMyOrdersInService = async (userId: string) => {
    return await prisma.order.findMany({
        where: {
            customerId: userId
        },
        include: {
            items: {
                include: {
                    medicine: {
                        select: {
                            name: true,
                            manufacturer: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const getOrderByIdInService = async (orderId: string, userId: string, userRole: string) => {
    const order = await prisma.order.findUniqueOrThrow({
        where: {
            id: orderId
         },
        include: {
            items: {
                include: {
                    medicine: {
                        select: {
                            name: true,
                            manufacturer: true,
                            imageUrl: true,
                            sellerId: true
                        }
                    }
                }
            }
        }
    });

    
    if (userRole === 'CUSTOMER' && order.customerId !== userId) {
        throw new Error("You do not have permission to view this order.");
    }

    if (userRole === 'SELLER') {
        const SellerItems = order.items.some(
            (item) => item.medicine.sellerId === userId
        );

        if (!SellerItems) {
            throw new Error("You can only view orders containing your products.");
        }
    }

    return order;
};

export const orderService = {
    createOrderInService,
    getMyOrdersInService,
    getOrderByIdInService
}