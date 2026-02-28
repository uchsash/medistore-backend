import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";


async function seedAdmin() {
    try {
        console.log("--- Admin Seeding Started ---");
        const adminData = {
            name: process.env.MSDB_ADMIN,
            email: process.env.MSDB_ADMIN_EMAIL,
            role: UserRole.ADMIN,
            password: process.env.MSDB_ADMIN_PASS
        }

        if (!adminData.email) {
            throw new Error("Admin email is not defined");
        }

        console.log("--- Checking Admin Exists or Not ---");
        // check if user already exists on db
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });

        if (existingUser) {
            throw new Error("User already exists!");
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            },
            body: JSON.stringify(adminData)
        })

        if (!signUpAdmin.ok) {

            const errorData = await signUpAdmin.json();
            console.error("--- Admin Creation Failed ---", errorData);
            return;
        }

        if (signUpAdmin.ok) {
            console.log("--- Admin Created ---");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });

            console.log("--- Email Verification Done ---");
        }

        console.log("--- Success! ---");
    }
    catch (err) {
        console.log(err);
    }
}

seedAdmin();