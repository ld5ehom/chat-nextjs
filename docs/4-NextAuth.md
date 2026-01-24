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

## Schema 구현 변경 사항

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

이번 Schema 구현에서는 **이메일 + 비밀번호 기반 인증(Credentials Provider)** 확장을 고려하여  
`User` 모델에 비밀번호 컬럼을 추가.

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

---

### DB 반영 방식

Schema 변경 이후 데이터베이스 반영은  
Prisma 모델과 실제 DB 상태를 동기화하는 방식으로 진행합니다.

- Prisma Schema 수정
- 데이터베이스 실행 상태 확인
- Prisma DB Sync 명령을 통해 테이블 생성 및 반영
