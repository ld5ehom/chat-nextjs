# pgAdmin 사용법

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

- 서버 생성

```
// Docker 실행 후

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

>> Save 클릭
>> 클릭하면 좌측 Servers 아래에 TypeORM(본인이 정한 이름) 코끼리 모양 뜸
```

```
좌측 TypeORM (해당 프로젝트 DB)
>> postgres >> Schemas >> Tables >> user
>> 상단부 엑셀모양 창 클릭
>> public.user/postgres/postgres@TypeORM 창이 새로 뜸
```

```
// Query 새 탭

SELECT * FROM public."user"
ORDER BY id ASC

// 데이터 저장하면 하단부 Data output 창에 한줄씩 들어감
```
