# [Login Session](https://github.com/ld5ehom/chat-nextjs/commit/83a5b0e83c180a14a570b60104ac1cd4af02698a)

## 로그인한 사용자만 특정 경로에 접근하기 (Next.js Middleware)

Next.js Middleware와 NextAuth의 JWT 세션을 사용하여 페이지가 렌더링되기 이전 단계에서 서버 단에서 접근 제어를 수행한다.

이 방식은 클라이언트 컴포넌트(useSession)에 의존하지 않고,  
요청(Request) 자체를 기준으로 인증 여부 및 권한을 판단하기 때문에 보안 측면에서 더 명확하고 안정적인 구조를 만든다.

- 공식 문서 참고

```
next-auth.js.org/configuration/nextjs#basic-usage
```

---

## Middleware.ts

- 모든 요청은 라우트로 전달되기 전에 middleware를 먼저 거친다
- next-auth/jwt의 getToken을 사용하여 JWT 기반 세션 정보를 조회한다
- 로그인 여부 및 사용자 권한(role)에 따라 접근을 허용하거나 차단한다
- 인증이 필요한 페이지를 서버 레벨에서 보호한다

## 접근 제어 정책

1. 로그인 사용자만 접근 가능한 경로

- /user 하위 경로
- 로그인되지 않은 상태에서 접근 시 /auth/login 페이지로 리다이렉트

2. 관리자(Admin) 전용 경로

- /admin 하위 경로
- 세션이 없거나 role이 admin이 아닐 경우 홈(/)으로 리다이렉트

3. 로그인된 사용자의 인증 페이지 접근 차단

- /auth 하위 경로
- 이미 로그인된 사용자는 로그인 / 회원가입 페이지 접근 불가
- 홈(/)으로 리다이렉트하여 재진입 방지

## middleware.ts

```
// export { default } from 'next-auth/middleware';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js Middleware (Request Guard)
// 모든 요청이 라우트로 도달하기 전에 실행되는 전처리 로직
// JWT 기반 세션을 확인하여 로그인 여부 및 권한(Role)에 따라 접근을 제어한다.
//
// 접근 정책
// - /user  : 로그인 사용자만 접근 가능
// - /admin : 관리자(admin)만 접근 가능
// - /auth  : 로그인 사용자는 접근 불가
export async function middleware(req: NextRequest) {
    // JWT 기반 세션 토큰 조회
    const session = await getToken({
        req,
        secret: process.env.JWT_SECRET,
    });

    // 현재 요청 경로
    const pathname = req.nextUrl.pathname;

    // 로그인된 사용자만 /user 경로 접근 가능
    if (pathname.startsWith("/user") && !session) {
        return NextResponse.redirect(
            new URL("/auth/login", req.url)
        );
    }

    // 관리자만 /admin 경로 접근 가능
    if (pathname.startsWith("/admin") && session?.role !== "admin") {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    // 로그인된 사용자는 /auth 경로 접근 불가
    if (pathname.startsWith("/auth") && session) {
        return NextResponse.redirect(
            new URL("/", req.url)
        );
    }

    // 조건에 해당하지 않으면 요청 계속 진행
    return NextResponse.next();
}

// Middleware 적용 경로
// 아래 경로에 해당하는 요청만 middleware가 실행된다
export const config = {
    matcher: [
        "/admin/:path*",
        "/auth/:path*",
        "/user/:path*",
    ],
};

```

## 정리

- Middleware를 사용하여 인증/인가 로직을 서버 단에서 처리
- JWT 토큰 기반 세션을 통해 로그인 상태를 일관되게 관리
- 클라이언트 의존 없이 경로 접근을 제어하는 구조 구성
- 이후 단계에서 세션 데이터에 토큰 정보를 병합하여 권한 처리 확장 예정

---

---

## 세션 데이터에 토큰 데이터 넣기

NextAuth 기본 Session 구조에는 `email`, `name`, `image` 정도의 기본 사용자 정보만 포함된다.  
하지만 **권한 제어(role)**, **사용자 식별(id)** 과 같은 서버·미들웨어 로직에 필요한 값은 기본 Session에 존재하지 않는다.
따라서 이번 단계에서는 **JWT(Token)에 포함된 사용자 데이터를 Session으로 전달**하는 구조를 구성했다.

### JWT → Session 데이터 흐름

NextAuth는 인증 과정 중 `callbacks`를 통해 JWT와 Session 데이터에 개입할 수 있다.
이 단계에서 사용하는 콜백은 다음 두 가지이다.

- jwt 콜백 : 로그인 시점에 실행되며, 사용자 정보(user)를 토큰(token)에 병합한다.
- session 콜백 : 클라이언트로 전달되기 직전에 실행되며, 토큰(token) 데이터를 세션(session)에 주입한다.

이 흐름을 통해 다음과 같은 구조가 만들어진다.

- 로그인 직후 : user 정보 → JWT token에 병합
- 클라이언트로 세션 전달 시 : token 데이터 → session.user로 전달

결과적으로 Session 객체에는 다음과 같은 데이터가 포함된다.

- 기본 정보
    - email
    - name
- 토큰 기반 확장 정보
    - id
    - role
    - exp
    - iat
    - jti (JWT ID)

이 구조는 이후 미들웨어 및 권한 분기 로직에서 사용된다.

---

### 세션 구조 확장에 따른 타입 문제

런타임에서는 `session.user.id`, `session.user.role` 접근이 가능하지만  
TypeScript 기준에서는 해당 필드가 정의되어 있지 않아 타입 에러가 발생한다.

이를 해결하기 위해 **NextAuth 타입을 확장(Module Augmentation)** 한다.

---

### NextAuth Session 타입 확장

파일 위치 : src/types/next-auth.d.ts

이 파일에서는 NextAuth 기본 타입을 확장하여 Session 객체의 user 필드에 커스텀 속성을 명시한다.

확장 대상

- Session.user
    - id
    - role
    - 기존 DefaultSession.user 속성 유지

이 작업을 통해 다음과 같은 접근이 타입 안정성을 갖게 된다.

- session?.user?.id
- session?.user?.role

---

### 작업 요약

- JWT 콜백을 통해 user 데이터를 token에 병합
- Session 콜백을 통해 token 데이터를 session.user로 전달
- Session 구조 변경에 맞춰 NextAuth 타입 확장
- 이후 미들웨어 및 UI에서 권한(role) 기반 로직을 구현할 수 있는 기반 마련
