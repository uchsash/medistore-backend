import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL!],
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
                    html: htmlTemplate,
                });

                console.log("Message sent:", info.messageId);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
    },
});