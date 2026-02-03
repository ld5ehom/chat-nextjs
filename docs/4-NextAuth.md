# Next Auth

## [NextAuth를 위한 DB 스키마 생성하기](https://github.com/ld5ehom/chat-nextjs/commit/515bae5f4a81fdbc4f6e69e5171871535562f45d)

## 참고 링크

https://authjs.dev/reference/adapter/prisma

## NextAuth를 위한 DB Schema 생성

NextAuth는 기본적으로 사용자(User), 계정(Account), 세션(Session), 인증 토큰(VerificationToken) 테이블 구조를 필요로 합니다.  
Prisma Adapter를 사용하는 경우, 공식에서 제공하는 스키마 구조를 그대로 사용하는 것이 권장됩니다.

## Prisma Extension 설치 (VS Code)

- Extension 이름: Prisma
- 제공: prisma.io
- 기능
    - Prisma schema 문법 하이라이팅
    - 자동 완성
    - 포맷팅
    - jump-to-definition

## Prisma Schema 구성 (NextAuth)

### Account 모델

```
model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade) //onDelete : Cascade -> 해당 유저를 지우면 해당 유저의 Account 도 삭제.

  @@id([provider, providerAccountId])
}
```

- userId는 User 테이블의 id를 참조
- User가 삭제되면 해당 User의 Account 데이터도 함께 삭제됨
- provider + providerAccountId 조합은 고유해야 함

### User 모델

```
// @id, @@id 모두 : 기본 키 지정
// @unique , @@unique : 유니크한 값
// cuid, uuid: cuid/uuid 사양에 따라 고유한 식별자 생성
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

```

---

### Session 모델

```
model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### VerificationToken 모델

```
model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}
```

---

## Schema를 이용한 DB 테이블 생성하기

Sync Database with Prisma Model

Once you have the Prisma Model ready, it's time to Sync it to your database.
Sync the database with the above-defined models by running this command:

```
docker-compose up -d
```

```
npx prisma db push
```

---

---

## [Schema 구현 변경 사항](https://github.com/ld5ehom/chat-nextjs/commit/8482d3efce0aef053222b9b9f0ff2879ccaf7377)

```
https://authjs.dev/getting-started/adapters/prisma
```

```
npx prisma db push
```

### Prisma Schema 관리 방식 변경

기존에는 `schema.prisma` 파일의 `datasource` 블록에서  
`url = env("DATABASE_URL")` 형태로 데이터베이스 연결 정보를 직접 정의하는 방식이 사용됨.

현재 구성에서는 **Prisma Schema 파일에서는 데이터 모델 정의만 유지**하고,  
데이터베이스 연결 정보(`DATABASE_URL`)는 외부 설정에서 관리하는 방식으로 변경.

이 변경은 다음과 같은 이유로 적용

- Prisma 최신 버전에서 `datasource.url` 사용 시 경고 메시지 발생
- 스키마 파일은 **DB 구조 정의 전용**으로 유지
- 환경별(DB, Docker, Local) 설정 분리를 통한 관리 용이성 확보
- Prisma Client / Migrate 설정 충돌 방지

---

### User 모델 구조 변경

기존 NextAuth Prisma Adapter 기본 스키마는 OAuth 기반 인증을 전제로 하여 비밀번호 필드를 포함하지 않습니다.

이번 Schema 구현에서는 **이메일 + 비밀번호 기반 인증(Credentials Provider)** 확장을 고려하여 `User` 모델에 비밀번호 컬럼을 추가.

- `hashedPassword` 필드 추가
- 단방향 암호화된 비밀번호 저장 용도
- OAuth 로그인 사용자에 대해서는 null 허용
- 추후 Credentials 인증 도입 시 스키마 변경 없이 바로 확장 가능

---

### Account 모델 구성 유지

Account 모델은 **NextAuth Prisma Adapter 공식 구조를 그대로 사용**

- 하나의 User는 여러 OAuth Account를 가질 수 있음
- OAuth 계정 고유성 보장을 위해 복합 기본 키 사용
- provider + providerAccountId 조합을 기본 키로 설정

이 구조는 OAuth 인증 흐름에서 필수적이므로 별도 변경 없이 유지합니다.

---

### Session / VerificationToken 모델 유지

Session, VerificationToken 모델 역시  
NextAuth 공식 Prisma Adapter 스키마 구조를 그대로 유지합니다.

- Session: 로그인 상태 및 세션 만료 관리
- VerificationToken: 이메일 인증, 비밀번호 재설정 등 토큰 기반 인증 처리

### DB 반영 방식

Schema 변경 이후 데이터베이스 반영은  
Prisma 모델과 실제 DB 상태를 동기화하는 방식으로 진행합니다.

- Prisma Schema 수정
- 데이터베이스 실행 상태 확인
- Prisma DB Sync 명령을 통해 테이블 생성 및 반영

---

---

## [Next Auth DB Schema 생성](https://github.com/ld5ehom/chat-nextjs/commit/4760e6d6af75d3b822c331451b20e6c9f32d6839)

```
https://authjs.dev/reference/adapter/prisma
```

### 패키지 설치

NextAuth와 Prisma Adapter를 사용하여 인증 기능을 구성한다.  
Pages Router 기반으로 인증 API를 구성한다.

- next-auth
- @prisma/client
- @next-auth/prisma-adapter
- prisma (개발 의존성)

```
npm install next-auth @prisma/client @next-auth/prisma-adapter
```

```
npm install prisma --save-dev
```

---

### 기본 개념

인증 관련 API는 Pages Router의 API Route를 통해 구성한다.

```
src/pages/api/auth/[...nextauth].ts
```

NextAuth는 `/api/auth` 경로로 들어오는 모든 인증 관련 요청을 내부적으로 처리한다.  
Pages Router를 사용하므로 `pages/api/auth` 경로에  
`[...nextauth].ts` 파일을 생성하여 인증 API를 구성한다.

---

### NextAuth 기본 설정 코드

NextAuth 설정은 Prisma Adapter를 사용하여 데이터베이스와 연결한다.  
이를 통해 인증 과정에서 생성되는 사용자, 계정, 세션 데이터가 자동으로 저장된다.

```
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default NextAuth({
  // adapter : 인증 관련 데이터를 DB에 저장하기 위한 Prisma Adapter
  adapter: PrismaAdapter(prisma),

  // providers : 사용할 로그인 방식을 정의
  // 기본 로그인 또는 소셜 로그인(Google, GitHub 등)
  providers: [],
})
```

---

### Prisma Adapter 사용 목적

Prisma Adapter는 인증 과정에서 생성되는 데이터(User, Account, Session, VerificationToken)를 Prisma Client를 통해 데이터베이스에 저장하고 관리하기 위한 연결 계층이다.

NextAuth는 Adapter를 통해 직접 SQL을 작성하지 않고도 인증 관련 테이블을 일관된 방식으로 관리한다.

---

### Provider 설정

providers는 어떤 로그인 방식을 사용할지 정의한다.

- OAuth 로그인 (Google, GitHub 등)
- Credentials 로그인 (이메일 / 비밀번호 등)

---

### Google OAuth 설정 예시

```
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default NextAuth({
  // adapter : 인증 관련 데이터를 DB에 저장하기 위한 Prisma Adapter
  adapter: PrismaAdapter(prisma),

  // providers : Google OAuth 로그인 설정
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})
```

---

### Schema를 이용한 DB 테이블 생성하기

```
npx prisma db push
```

---

### 정리

- Pages Router 기반으로 인증 구성
- src/pages/api/auth/[...nextauth].ts 단일 파일 사용
- Prisma Adapter를 통해 인증 관련 테이블 자동 관리
- OAuth 및 Credentials 로그인 방식 확장 가능

---

---

## [Next Auth 설정하기]()

### 패키지 설치

NextAuth 인증 구성과 Credentials 기반 로그인(이메일 / 비밀번호)을 위해 Prisma 및 비밀번호 암호화 관련 패키지를 설치한다.

```
npm install prisma --save-dev
```

```
npm install bcryptjs
```

```
npm install -D @types/bcryptjs
```

---

### 오늘 작업 내용 정리

- NextAuth 인증 API 구성
    - src/pages/api/auth/[...nextauth].ts 파일 업데이트
    - Prisma Adapter 연동을 통해 인증 데이터(User, Account, Session) 관리
    - Google / Github OAuth Provider 설정
    - Credentials Provider(이메일 / 비밀번호) 추가

- Prisma 연동 구조 정리
    - Prisma Client 전역 인스턴스 분리
    - src/helpers/prismadb.ts 파일 생성
    - 개발 환경에서 Hot Reload 시 Prisma 인스턴스 중복 생성 방지

- 인증 로직 구현
    - bcryptjs를 이용한 비밀번호 비교 로직 추가
    - 이메일 기준 사용자 조회 및 인증 처리
    - Credentials 인증 실패 시 예외 처리

- 네비게이션 로그인 상태 분기
    - useSession 대신 서버에서 전달된 currentUser 기반 분기
    - 로그인 상태에 따라 Admin / User / Signout 메뉴 렌더링
    - 비로그인 상태에서는 Signin 버튼만 노출

- 프로젝트 설정 정리
    - tsconfig.json path alias(@/\*) 설정 추가
    - NextAuth, Prisma, Credentials 인증 흐름 정상 동작 확인

---
