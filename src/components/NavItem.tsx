import React from "react";
import { User } from "@prisma/client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";

interface NavItemProps {
    mobile?: boolean;
    currentUser?: User | null;
}

// NavItem component
// 네비게이션 메뉴 항목을 렌더링하는 컴포넌트로,
// desktop / mobile 환경에 따라 스타일 및 레이아웃 확장을 위해 mobile props를 받음
// mobile 값이 true일 경우 모바일 전용 네비게이션 영역에서 사용됨
const NavItem = ({ mobile, currentUser }: NavItemProps) => {
    return (
        // Navigation list
        <ul
            className={`text-md justify-center flex w-full gap-4 ${
                mobile && "flex-col h-full"
            } items-center`}
        >
            {currentUser ? (
                <>
                    <li
                        className={`py-2 text-center border-b-4 cursor-pointer`}
                    >
                        <Link href={"/admin"}>Admin</Link>
                    </li>
                    <li
                        className={`py-2 text-center border-b-4 cursor-pointer`}
                    >
                        <Link href={"/user"}>User</Link>
                    </li>
                    <li
                        className={`py-2 text-center border-b-4 cursor-pointer`}
                    >
                        <button onClick={() => signOut()}>Signout</button>
                    </li>
                </>
            ) : (
                <li className={`py-2 text-center border-b-4 cursor-pointer`}>
                    <button onClick={() => signIn()}>Signin</button>
                </li>
            )}
        </ul>
    );
};

export default NavItem;
