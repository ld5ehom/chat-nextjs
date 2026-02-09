import bcrypt from "bcryptjs";
import prisma from "../src/helpers/prismadb";

// test@test.com
// 1234
async function main() {
    const hashedPassword = await bcrypt.hash("1234", 10);

    await prisma.user.create({
        data: {
            email: "test@test.com",
            hashedPassword,
            role: "User",
        },
    });
}

main();
