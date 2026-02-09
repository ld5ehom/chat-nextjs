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
            async authorize(_credentials, _req) {
                // Add logic here to look up the user from the credentials supplied

                const user = {
                    id: "1",
                    name: "J Smith",
                    email: "jsmith@example.com",
                    role: "User",
                };

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details
                    return null;
                }

                // You can also Reject this callback with an Error thus the user will be sent to the error page
            },
        }),
    ],
    // SignIn Test
    // pages: {
    //     signIn: "/auth/login",
    // },
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    // debug: true,
    callbacks: {
        // Attach JWT token data to session object
        // JWT 토큰 데이터를 세션(session)에 병합하여
        // 클라이언트 및 미들웨어에서 사용자 식별/권한 정보를 사용할 수 있도록 처리
        async jwt({ token, user }) {
            // console.log('token', token);
            // console.log('user', user);
            return { ...token, ...user };
        },

        // Expose token data through session.user
        // jwt 콜백에서 확장된 토큰 데이터를 session.user에 주입
        // 이후 UI, 서버 컴포넌트, 미들웨어에서 동일한 사용자 데이터 사용 가능
        async session({ session, token }) {
            // console.log('@', session, token);
            session.user = token;
            return session;
        },
    },
};

export default NextAuth(authOptions);
