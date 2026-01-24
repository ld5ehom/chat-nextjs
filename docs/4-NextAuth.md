# Next Auth

## NextAuth를 위한 DB 스키마 생성하기

## 참고 링크

https://authjs.dev/reference/adapter/prisma

---

## NextAuth를 위한 DB Schema 생성

NextAuth는 기본적으로 사용자(User), 계정(Account), 세션(Session), 인증 토큰(VerificationToken) 테이블 구조를 필요로 합니다.  
Prisma Adapter를 사용하는 경우, 공식에서 제공하는 스키마 구조를 그대로 사용하는 것이 권장됩니다.

---

## Prisma Extension 설치 (VS Code)

- Extension 이름: Prisma
- 제공: prisma.io
- 기능
    - Prisma schema 문법 하이라이팅
    - 자동 완성
    - 포맷팅
    - jump-to-definition

---

## Prisma Schema 구성 (NextAuth)

### Account 모델

```
    model Account {
      id                String  @id @default(cuid())
      userId            String
      type              String
      provider          String
      providerAccountId String
      refresh_token     String? @db.Text
      access_token      String? @db.Text
      expires_at        Int?
      token_type        String?
      scope             String?
      id_token          String? @db.Text
      session_state     String?

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@unique([provider, providerAccountId])
    }
```

- userId는 User 테이블의 id를 참조
- User가 삭제되면 해당 User의 Account 데이터도 함께 삭제됨
- provider + providerAccountId 조합은 고유해야 함

---

### User 모델

```
    model User {
      id            String   @id @default(cuid())
      name          String?
      email         String?  @unique
      emailVerified DateTime?
      image         String?

      accounts Account[]
      sessions Session[]
    }
```

---

### Session 모델

```
    model Session {
      id           String   @id @default(cuid())
      sessionToken String   @unique
      userId       String
      expires      DateTime

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    }
```

---

### VerificationToken 모델

```
    model VerificationToken {
      identifier String
      token      String   @unique
      expires    DateTime

      @@unique([identifier, token])
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
