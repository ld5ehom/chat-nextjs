export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js Middleware (Request Guard)
// 모든 요청이 라우트로 도달하기 전에 실행되는 전처리 로직으로,
// JWT 기반 세션을 확인하여 로그인 여부 및 권한(Role)에 따라 접근을 제어한다.
// - /user  : 로그인 사용자만 접근 가능
// - /admin : 관리자(admin)만 접근 가능
// - /auth  : 로그인 사용자는 접근 불가(이미 로그인된 사용자가 로그인/회원가입 페이지 재진입 방지)
export async function middleware(req: NextRequest) {
    // Get session token from JWT (JWT 기반 세션 토큰 조회)
    const session = await getToken({ req, secret: process.env.JWT_SECRET });

    // Current request path (현재 요청 경로)
    const pathname = req.nextUrl.pathname;

    // console.log("session", session);
    // console.log(req.nextUrl.pathname);

    // Allow only authenticated users (로그인된 유저만 접근 가능)
    // If not logged in, redirect to login page (/user 경로 접근 시 비로그인 상태면 로그인 페이지로 이동)
    if (pathname.startsWith("/user") && !session) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Allow only admin users (어드민 유저만 접근 가능)
    // If role is not admin, redirect to home (/admin 접근 시 admin 권한이 아니면 홈으로 이동)
    if (pathname.startsWith("/admin") && session?.role !== "Admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Block auth pages for logged-in users (로그인된 유저는 로그인/회원가입 페이지 접근 불가)
    // If already logged in, redirect to home (/auth 접근 시 로그인 상태면 홈으로 이동)
    if (pathname.startsWith("/auth") && session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Continue request (조건에 해당하지 않으면 요청 계속 진행)
    return NextResponse.next();
}

// Middleware matchers (Middleware 적용 경로)
// Only requests matching these paths will be processed by this middleware
// 아래 경로로 들어오는 요청만 middleware에서 처리한다.
export const config = {
    matcher: ["/admin/:path*", "/auth/:path*"],
};
