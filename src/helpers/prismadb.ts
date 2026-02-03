import { PrismaClient } from "@prisma/client";

// PrismaClient를 전역으로 캐싱하여
// 개발 환경에서 Hot Reload 시 인스턴스 중복 생성을 방지
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
