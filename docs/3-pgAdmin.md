# [pgAdmin 사용법](https://github.com/ld5ehom/chat-nextjs/commit/41581bf57617eba5ebc52638408206612c6b1988)

pgAdmin (데이터베이스를 보는 툴(Tool)입니다.)

## Window 에서 PostgresSQL 설치하기

```
https://www.postgresql.org/download/windows/
```

---

## Mac 에서 PostgresSQL 설치하기

```
https://postgresapp.com/downloads.html
```

### Homebrew로 설치하기

```
brew install postgresql
```

### PostgreSQL 실행

```
brew services start postgresql

또는 일회성 실행

postgres -D /opt/homebrew/var/postgresql
```

### 설치 확인

```
psql --version
```

---

## Window & Mac 에서 pgAdmin 설치하기

```
https://www.pgadmin.org/download/
```

---

## 서버 생성

- Docker 실행 후

```
docker-compose up
```

```
Servers 우 클릭 >> Register >> Server... 클릭

Register-Server 창
General 탭
Name : 서버이름

Connection 창
Host name/address : localhost (호스트 이름)
Port: 5432 (원하는 포트번호)
Maintenance : Postgres (DB 이름)
Username : Postgres (User 이름)
Password : password

> > Save 클릭
> > 클릭하면 좌측 Servers 아래에 TypeORM(본인이 정한 이름) 코끼리 모양 뜸

```

```

좌측 TypeORM (해당 프로젝트 DB)

> > postgres >> Schemas >> Tables >> user
> > 상단부 엑셀모양 창 클릭
> > public.user/postgres/postgres@TypeORM 창이 새로 뜸

```

```

// Query 새 탭

SELECT \* FROM public."user"
ORDER BY id ASC

// 데이터 저장하면 하단부 Data output 창에 한줄씩 들어감

```

---

---

---

## [PostgreSQL + Prisma DB 연결]

### 작업 목적

- 로컬 환경에서 PostgreSQL 데이터베이스 실행
- Prisma ORM을 이용한 데이터베이스 연결
- 초기 마이그레이션을 통해 테이블 생성
- pgAdmin을 통한 데이터 확인

---

### 1. Docker 기반 PostgreSQL 실행

- PostgreSQL 버전: 15
- 포트: 5432
- 기본 데이터베이스: postgres
- 로컬 볼륨 마운트로 데이터 영속성 유지

```
docker-compose down -v
docker-compose up -d
```

---

### 2. 환경 변수 설정

- Prisma에서 사용할 데이터베이스 연결 정보 설정

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

---

### 3. Prisma 스키마 작성

- `schema.prisma` 파일에 모델 정의
- 데이터베이스 테이블 구조를 코드로 관리

---

### 4. Prisma 마이그레이션 실행

- 스키마 기준으로 실제 DB에 테이블 생성

```
npx prisma migrate dev --name init
```

---

### 5. pgAdmin 확인

- Databases → postgres
- Schemas → public → Tables
- 생성된 테이블 목록 확인

---

### 현재 상태 요약

- PostgreSQL 컨테이너 정상 실행
- Prisma와 PostgreSQL 연결 완료
- 마이그레이션 적용 완료
- pgAdmin에서 데이터베이스 및 테이블 조회 가능

---
