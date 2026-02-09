# 권한에 따른 인가 처리(authorization)

- admin 페이지는 admin 권한이 있는 유저만 들어갈 수 있게 변경

## schema.prisma

- model User에 userTpye 추가함

```
model User {
  // admin user (default는 User로 설정)
  userType       UserType  @default(User)
}
```

- Docker 실행 후 up

```
docker-compose up -d
```

```
npx prisma db push
```

---

## nextauth.ts

- role: 에 User / admin 추가

```
const user = {
    id: "1",
    name: "J Smith",
    email: "jsmith@example.com",
    role: "User",
};
```

## seed.ts

- Prisma Test 아이디

```
npm install -D ts-node
```

```
import bcrypt from "bcryptjs";
import prisma from "../src/helpers/prismadb";

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
```
