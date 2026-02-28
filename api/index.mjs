// src/app.ts
import express6 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  medicines Medicine[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  @@index([name])\n}\n\nmodel Medicine {\n  id           String      @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  manufacturer String\n  stock        Int         @default(0)\n  imageUrl     String?\n  categoryId   String\n  category     Category    @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n  sellerId     String\n  seller       User        @relation(fields: [sellerId], references: [id], onDelete: Cascade)\n  orderItems   OrderItem[]\n  reviews      Review[]\n  createdAt    DateTime    @default(now())\n  updatedAt    DateTime    @updatedAt\n\n  @@index([manufacturer])\n  @@index([name])\n  @@index([categoryId])\n  @@index([sellerId])\n  @@index([price])\n  @@map("medicines")\n}\n\nenum OrderStatus {\n  PENDING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  customerId      String\n  customer        User        @relation(fields: [customerId], references: [id])\n  totalAmount     Float\n  shippingAddress String\n  status          OrderStatus @default(PENDING)\n  items           OrderItem[]\n  createdAt       DateTime    @default(now())\n\n  @@index([customerId])\n  @@index([status])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Restrict)\n  quantity   Int\n  price      Float\n}\n\nenum ReviewStatus {\n  PUBLISHED\n  UNPUBLISHED\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  rating     Int\n  comment    String?\n  status     ReviewStatus @default(PUBLISHED)\n  userId     String\n  user       User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  medicineId String\n  medicine   Medicine     @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  medicines Medicine[]\n  reviews   Review[]\n  orders    Order[]\n\n  role   String  @default("CUSTOMER")\n  phone  String?\n  status String  @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: ["CUSTOMER", "SELLER", "ADMIN"],
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: ["ACTIVE", "BANNED"],
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; }
                    .content { padding: 30px 0; color: #333333; line-height: 1.6; }
                    .button-container { text-align: center; margin: 30px 0; }
                    .button { background-color: #4F46E5; color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
                    .footer { text-align: center; font-size: 12px; color: #777777; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Wellcome to Medistore</h2>
                    </div>
                    <div class="content">
                        <p>Hi <strong>${user.name}</strong>,</p>
                        <p>Thank you for signing up! To get started and secure your account, please verify your email address by clicking the button below.</p>
                        <div class="button-container">
                            <a href="${verificationUrl}" class="button">Verify My Email</a>
                        </div>
                        <p>If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 Medistore. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `;
        const info = await transporter.sendMail({
          from: '"Medistore" <admin@medistore.com>',
          to: user.email,
          subject: "Verify your email - Medistore",
          html: htmlTemplate
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/routes/index.ts
import { Router as Router6 } from "express";

// src/modules/medicine/medicine.router.ts
import express from "express";

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email Verification Required. Please, verify your email."
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access to this resources."
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var auth_default = auth2;

// src/modules/medicine/medicine.service.ts
var createMedicineInService = async (data, userId) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      sellerId: userId
    }
  });
  return result;
};
var getAllMedicineInService = async ({
  search,
  page,
  limit,
  skip,
  finalSortBy,
  sortOrder,
  sellerId,
  categoryId
}) => {
  const andConditions = [];
  const searchNumber = parseFloat(search);
  const isNumber = !isNaN(searchNumber);
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        },
        ...isNumber ? [
          { price: { equals: searchNumber } },
          { stock: { equals: Math.floor(searchNumber) } }
        ] : []
      ]
    });
  }
  if (sellerId) {
    andConditions.push({
      sellerId
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId
    });
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
};
var getMedicineByIdInService = async (medId) => {
  return await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medId
    },
    include: {
      category: true,
      reviews: {
        where: {
          status: "PUBLISHED"
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
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });
};
var updateMedicineInService = async (medId, sellerId, sellerRole, updateData) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medId
    }
  });
  if (sellerRole !== "ADMIN" && medicine.sellerId !== sellerId) {
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
var deleteMedicineInService = async (medId, sellerId, sellerRole) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medId
    }
  });
  if (sellerRole !== "ADMIN" && medicine.sellerId !== sellerId) {
    throw new Error("You do not have permission to delete this medicine.");
  }
  const result = await prisma.medicine.delete({
    where: {
      id: medId
    }
  });
  return result;
};
var medicineService = {
  createMedicineInService,
  getAllMedicineInService,
  getMedicineByIdInService,
  updateMedicineInService,
  deleteMedicineInService
};

// src/helpers/paginationSortingHelper.ts
var paginationAndSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 6;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationAndSortingHelper;

// src/modules/medicine/medicine.controller.ts
var createMedicine = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized"
      });
    }
    const result = await medicineService.createMedicineInService(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Medicine creation failed",
      details: error instanceof Error ? error.message : error
    });
  }
};
var getAllMedicine = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const allowedSortFields = ["name", "price", "manufacturer", "stock", "createdAt"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sellerId = req.query.sellerId;
    const categoryId = req.query.categoryId;
    const result = await medicineService.getAllMedicineInService({ search: searchString, page, limit, skip, finalSortBy, sortOrder, sellerId, categoryId });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Medicine retrival failed",
      details: err instanceof Error ? err.message : err
    });
  }
};
var getMyMedicine = async (req, res) => {
  try {
    const currentSellerId = req.user?.id;
    if (!currentSellerId) {
      throw new Error("You must be logged in to view your added medicines.");
    }
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const allowedSortFields = ["name", "price", "manufacturer", "stock", "createdAt"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const categoryId = req.query.categoryId;
    const result = await medicineService.getAllMedicineInService({ search: searchString, page, limit, skip, finalSortBy, sortOrder, sellerId: currentSellerId, categoryId });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: "Medicine retrival failed",
      details: err instanceof Error ? err.message : err
    });
  }
};
var getMedicineById = async (req, res) => {
  try {
    const { medId } = req.params;
    if (!medId) {
      throw new Error("Medicine Id is required!");
    }
    const result = await medicineService.getMedicineByIdInService(medId);
    res.status(200).json({
      success: true,
      message: "Medicine retrieved successfully!",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      error: "Medicine retrive by Id failed",
      details: err
    });
  }
};
var updateMedicine = async (req, res) => {
  try {
    const { medId } = req.params;
    const currentSellerId = req.user?.id;
    const currentSellerRole = req.user?.role;
    if (!currentSellerId || !currentSellerRole) {
      throw new Error("You must be logged in to update medicine.");
    }
    const result = await medicineService.updateMedicineInService(medId, currentSellerId, currentSellerRole, req.body);
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
var deleteMedicine = async (req, res) => {
  try {
    const { medId } = req.params;
    const currentSellerId = req.user?.id;
    const currentSellerRole = req.user?.role;
    if (!currentSellerId || !currentSellerRole) {
      throw new Error("You must be logged in to delete medicine.");
    }
    const result = await medicineService.deleteMedicineInService(medId, currentSellerId, currentSellerRole);
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Medicine deletion failed.",
      details: error.message || error
    });
  }
};
var medicineController = {
  createMedicine,
  getAllMedicine,
  getMyMedicine,
  getMedicineById,
  updateMedicine,
  deleteMedicine
};

// src/modules/medicine/medicine.router.ts
var router = express.Router();
router.post(
  "/",
  auth_default("SELLER" /* SELLER */),
  medicineController.createMedicine
);
router.get(
  "/",
  medicineController.getAllMedicine
);
router.get(
  "/my-medicine",
  auth_default("SELLER" /* SELLER */),
  medicineController.getMyMedicine
);
router.get(
  "/:medId",
  medicineController.getMedicineById
);
router.patch(
  "/:medId",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.updateMedicine
);
router.delete(
  "/:medId",
  auth_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.deleteMedicine
);
var medicineRouter = router;

// src/modules/category/category.router.ts
import express2 from "express";

// src/modules/category/category.service.ts
var createCategoryInService = async (name) => {
  const result = await prisma.category.create({
    data: {
      name
    }
  });
  return result;
};
var getAllCategoryInService = async (sortBy, sortOrder) => {
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
};
var getCategoryByIdInService = async (catId, sortBy, sortOrder) => {
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
};
var updateCategoryInService = async (catId, newName) => {
  return await prisma.category.update({
    where: {
      id: catId
    },
    data: {
      name: newName
    }
  });
};
var deleteCategoryInService = async (catId) => {
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
var categoryService = {
  createCategoryInService,
  getAllCategoryInService,
  getCategoryByIdInService,
  updateCategoryInService,
  deleteCategoryInService
};

// src/modules/category/category.controller.ts
var createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategoryInService(req.body.name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Category creation failed",
      details: error instanceof Error ? error.message : error
    });
  }
};
var getAllCategory = async (req, res) => {
  try {
    const { sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const allowedSortFields = ["name", "createdAt"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
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
    });
  }
};
var getCategoryById = async (req, res) => {
  try {
    const { catId } = req.params;
    const { sortBy, sortOrder } = paginationSortingHelper_default(req.query);
    const allowedSortFields = ["name", "createdAt"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    if (!catId) {
      throw new Error("Category Id is required");
    }
    const result = await categoryService.getCategoryByIdInService(catId, finalSortBy, sortOrder);
    res.status(200).json({
      success: true,
      message: "Category Data fetched successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category fetched unsuccessful."
    });
  }
};
var updateCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    if (!catId) {
      throw new Error("Category Id is required");
    }
    const result = await categoryService.updateCategoryInService(catId, req.body.name);
    res.status(200).json({
      success: true,
      message: "Category Data updated successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category update unsuccessful."
    });
  }
};
var deleteCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    if (!catId) {
      throw new Error("Category Id is required");
    }
    const result = await categoryService.deleteCategoryInService(catId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category delete failed."
    });
  }
};
var categoryController = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.router.ts
var router2 = express2.Router();
router2.post(
  "/",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
router2.get(
  "/",
  categoryController.getAllCategory
);
router2.get(
  "/:catId",
  categoryController.getCategoryById
);
router2.patch(
  "/:catId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
router2.delete(
  "/:catId",
  auth_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var categoryRouter = router2;

// src/modules/order/order.router.ts
import express3 from "express";

// src/modules/order/order.service.ts
var createOrderInService = async (userId, orderData) => {
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
      calculatedTotalAmount = calculatedTotalAmount + itemPrice * item.quantity;
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
        status: "PENDING",
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
var getMyOrdersInService = async (userId) => {
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
      createdAt: "desc"
    }
  });
};
var getOrderByIdInService = async (orderId, userId, userRole) => {
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
  if (userRole === "CUSTOMER" && order.customerId !== userId) {
    throw new Error("You do not have permission to view this order.");
  }
  if (userRole === "SELLER") {
    const SellerItems = order.items.some(
      (item) => item.medicine.sellerId === userId
    );
    if (!SellerItems) {
      throw new Error("You can only view orders containing your products.");
    }
  }
  return order;
};
var getSellerOrdersInService = async (sellerId) => {
  return await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId
          }
        }
      }
    },
    include: {
      items: {
        where: {
          medicine: {
            sellerId
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
      createdAt: "desc"
    }
  });
};
var updateOrderStatusInService = async (orderId, newStatus, userId, userRole) => {
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
  if (userRole === "CUSTOMER") {
    if (order.customerId !== userId) {
      throw new Error("You do not have permission to access this order.");
    }
    if (newStatus !== "CANCELLED") {
      throw new Error("You can only cancel orders.");
    }
  }
  if (userRole === "SELLER") {
    const SellerItems = order.items.some(
      (item) => item.medicine.sellerId === userId
    );
    if (!SellerItems) {
      throw new Error("You can only view orders containing your products.");
    }
  }
  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    throw new Error(`Cannot change status of an order that is already ${order.status}.`);
  }
  if (newStatus === "CANCELLED") {
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
var getAllOrdersForAdminInService = async () => {
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
      createdAt: "desc"
    }
  });
};
var orderService = {
  createOrderInService,
  getMyOrdersInService,
  getOrderByIdInService,
  getSellerOrdersInService,
  updateOrderStatusInService,
  getAllOrdersForAdminInService
};

// src/modules/order/order.controller.ts
var createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    ;
    const result = await orderService.createOrderInService(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not place order",
      details: error.message || error
    });
  }
};
var getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized.");
    }
    const result = await orderService.getMyOrdersInService(userId);
    res.status(200).json({
      success: true,
      message: "Order history retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order retrive failed.",
      details: error.message || error
    });
  }
};
var getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      throw new Error("Authentication required.");
    }
    const result = await orderService.getOrderByIdInService(orderId, userId, userRole);
    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order details retrieve failed.",
      details: error.message || error
    });
  }
};
var getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) throw new Error("Unauthorized access.");
    const result = await orderService.getSellerOrdersInService(sellerId);
    res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch incoming orders.",
      details: error.message
    });
  }
};
var updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId || !userRole) {
      throw new Error("Unauthorized");
    }
    if (!orderId) {
      throw new Error("Order doesn't exists.");
    }
    const result = await orderService.updateOrderStatusInService(orderId, status, userId, userRole);
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status} successfully!`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order status update failed.",
      details: error.message
    });
  }
};
var getAllOrdersForAdmin = async (req, res) => {
  try {
    const result = await orderService.getAllOrdersForAdminInService();
    res.status(200).json({
      success: true,
      message: "All the orders retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch all the orders.",
      details: error.message
    });
  }
};
var orderController = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  getAllOrdersForAdmin
};

// src/modules/order/order.router.ts
var router3 = express3.Router();
router3.post(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */),
  orderController.createOrder
);
router3.get(
  "/my-orders",
  auth_default("CUSTOMER" /* CUSTOMER */),
  orderController.getMyOrders
);
router3.get(
  "/manage",
  auth_default("SELLER" /* SELLER */),
  orderController.getSellerOrders
);
router3.get(
  "/admin/orders",
  auth_default("ADMIN" /* ADMIN */),
  orderController.getAllOrdersForAdmin
);
router3.get(
  "/:orderId",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.getOrderById
);
router3.patch(
  "/:orderId",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.updateOrderStatus
);
var orderRouter = router3;

// src/modules/user/user.router.ts
import express4 from "express";

// src/modules/user/user.service.ts
var getMyProfileInService = async (userId) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var updateMyProfileInService = async (userId, data) => {
  const { role, status, email, ...updateData } = data;
  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};
var getAllUsersInService = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateUserStatusInService = async (targetUserId, status) => {
  return await prisma.user.update({
    where: { id: targetUserId },
    data: { status }
  });
};
var userService = {
  getMyProfileInService,
  updateMyProfileInService,
  getAllUsersInService,
  updateUserStatusInService
};

// src/modules/user/user.controller.ts
var getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await userService.getMyProfileInService(userId);
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
      details: error.message
    });
  }
};
var updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");
    const result = await userService.updateMyProfileInService(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
      details: error.message
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersInService();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch users",
      details: error.message
    });
  }
};
var updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) throw new Error("Status is required");
    const result = await userService.updateUserStatusInService(id, status);
    res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully!`,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update user status",
      details: error.message
    });
  }
};
var userController = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus
};

// src/modules/user/user.router.ts
var router4 = express4.Router();
router4.get(
  "/me",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  userController.getMyProfile
);
router4.patch(
  "/me",
  auth_default("CUSTOMER" /* CUSTOMER */, "SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  userController.updateMyProfile
);
router4.get(
  "/admin/users",
  auth_default("ADMIN" /* ADMIN */),
  userController.getAllUsers
);
router4.patch(
  "/admin/users/:id",
  auth_default("ADMIN" /* ADMIN */),
  userController.updateUserStatus
);
var userRouter = router4;

// src/modules/reviews/review.route.ts
import express5 from "express";

// src/modules/reviews/review.service.ts
var createReviewInService = async (userId, payload) => {
  const deliveredOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      status: "DELIVERED",
      items: {
        some: {
          medicineId: payload.medicineId
        }
      }
    }
  });
  if (!deliveredOrder) {
    throw new Error("You can only review medicines that you have purchased.");
  }
  return await prisma.review.create({
    data: {
      userId,
      medicineId: payload.medicineId,
      rating: payload.rating,
      comment: payload.comment
    }
  });
};
var updateReviewStatusInService = async (reviewId, newStatus) => {
  const existingReview = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId
    }
  });
  if (existingReview.status === newStatus) {
    throw new Error(`Review status is already ${newStatus}.`);
  }
  return await prisma.review.update({
    where: {
      id: reviewId
    },
    data: {
      status: newStatus
    }
  });
};
var deleteReviewInService = async (reviewId) => {
  return await prisma.review.delete({
    where: {
      id: reviewId
    }
  });
};
var reviewServices = {
  createReviewInService,
  updateReviewStatusInService,
  deleteReviewInService
};

// src/modules/reviews/review.controller.ts
var createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const result = await reviewServices.createReviewInService(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Review posted successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Review posting failed",
      details: error.message
    });
  }
};
var updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { newStatus } = req.body;
    const result = await reviewServices.updateReviewStatusInService(reviewId, newStatus);
    res.status(200).json({
      success: true,
      message: "Review update successful!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Review update failed",
      details: error.message
    });
  }
};
var deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const result = await reviewServices.deleteReviewInService(reviewId);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Review deletion failed",
      details: error.message
    });
  }
};
var reviewController = {
  createReview,
  updateReviewStatus,
  deleteReview
};

// src/modules/reviews/review.route.ts
var router5 = express5.Router();
router5.post(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */),
  reviewController.createReview
);
router5.patch(
  "/:reviewId",
  auth_default("ADMIN" /* ADMIN */),
  reviewController.updateReviewStatus
);
router5.delete(
  "/:reviewId",
  auth_default("ADMIN" /* ADMIN */),
  reviewController.deleteReview
);
var reviewRouter = router5;

// src/routes/index.ts
var router6 = Router6();
var routerManager = [
  {
    path: "/medicines",
    route: medicineRouter
  },
  {
    path: "/categories",
    route: categoryRouter
  },
  {
    path: "/orders",
    route: orderRouter
  },
  {
    path: "/users",
    route: userRouter
  },
  {
    path: "/reviews",
    route: reviewRouter
  }
];
routerManager.forEach((r) => router6.use(r.path, r.route));
var routes_default = router6;

// src/app.ts
var app = express6();
app.set("trust proxy", 1);
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express6.json());
app.use("/api", routes_default);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, Medistore!");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
