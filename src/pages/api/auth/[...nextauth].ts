import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/helpers/prismadb";
import bcrypt from "bcryptjs";

// PrismaClient를 이용해서 instance 생성, 이것을 이용해 DB 접근
// const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    // adapter : 인증 관련 데이터를 DB에 저장하기 위한 Prisma Adapter
    adapter: PrismaAdapter(prisma),

    // providers : Google OAuth 로그인 설정(예시)
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),

        // next-auth.js.org/providers/credentials
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            // DB에서 유저에 맞는 정보를 가져옴
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword,
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    debug: true,
    callbacks: {
        // async jwt({ token, user }) {
        //     return { ...token, ...user }
        // },
        // async session({ session, token }) {
        //     session.user = token;
        //     return session;
        // }
    },
};

export default NextAuth(authOptions);
