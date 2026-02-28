import { OrderStatus } from "../../../generated/prisma/enums";
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

const getSellerOrdersInService = async (sellerId: string) => {
    return await prisma.order.findMany({
        where: {
            items: {
                some: {
                    medicine: {
                        sellerId: sellerId
                    }
                }
            }
        },
        include: {
            items: {
                where: {
                    medicine: {
                        sellerId: sellerId
                    }
                },
                include: {
                    medicine: {
                        select: {
                            name: true,
                            manufacturer: true,
                            price: true
                        }
                    }
                }
            },
            customer: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const updateOrderStatusInService = async (orderId: string, newStatus: OrderStatus, userId: string, userRole: string) => {

    const order = await prisma.order.findUniqueOrThrow({
        where: {
            id: orderId
        },
        include: {
            items: {
                include: {
                    medicine: true
                }
            }
        }
    });


    if (userRole === 'CUSTOMER') {
        if (order.customerId !== userId) {
            throw new Error("You do not have permission to access this order.");
        }

        if (newStatus !== 'CANCELLED') {
            throw new Error("You can only cancel orders.");
        }

        if (order.status !== "PENDING") {
            throw new Error("You can only cancel an order while it is PENDING.");
        }
    }

    if (userRole === 'SELLER') {
        const SellerItems = order.items.some(
            (item) => item.medicine.sellerId === userId
        );

        if (!SellerItems) {
            throw new Error("You can only view orders containing your products.");
        }
    }


    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        throw new Error(`Cannot change status of an order that is already ${order.status}.`);
    }

    if (newStatus === 'CANCELLED') {
        return await prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                await tx.medicine.update({
                    where: {
                        id: item.medicineId
                    },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }
            return await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: newStatus
                }
            });
        });
    }

    return await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status: newStatus
        }
    });
};

const getAllOrdersForAdminInService = async () => {
    return await prisma.order.findMany({
        include: {
            customer: {
                select: {
                    name: true,
                    email: true
                }
            },
            items: {
                include: {
                    medicine: {
                        select: {
                            name: true,
                            manufacturer: true,
                            sellerId: true
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

export const orderService = {
    createOrderInService,
    getMyOrdersInService,
    getOrderByIdInService,
    getSellerOrdersInService,
    updateOrderStatusInService,
    getAllOrdersForAdminInService
}