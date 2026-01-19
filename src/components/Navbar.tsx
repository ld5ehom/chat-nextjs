"use client";

import Link from "next/link";
import { useState } from "react";
import NavItem from "./NavItem";

// Navbar component
// 이 컴포넌트는 앱 전역 상단 네비게이션 UI를 렌더링한다.
// 데스크탑(sm 이상)에서는 NavItem을 가로 메뉴로 노출하고, 모바일(sm 미만)에서는 토글 버튼(+/-)을 통해 메뉴를 열고 닫는다.
// 내부 상태(menu)를 통해 모바일 메뉴의 표시 여부를 제어하며, 메뉴가 열렸을 때만 <NavItem mobile />을 조건부 렌더링한다.
// TailwindCSS 유틸리티 클래스를 사용해 레이아웃(정렬/여백/반응형 표시)과 스타일(배경색, 텍스트 색, z-index)을 적용한다.
const Navbar = () => {
    // Menu state
    const [menu, setMenu] = useState(false);

    // Menu toggle handler (T/F)
    const handleMenu = () => {
        setMenu(!menu);
    };

    return (
        // Navigation container (상단에 고정되는 네비게이션 영역)
        <nav className="relative z-10 w-full text-white bg-blue-500">
            {/* Top navigation bar */}
            {/* 로고와 메뉴 버튼, 데스크탑 메뉴를 포함하는 상단 영역 */}
            <div className="flex items-center justify-between mx-5 sm:mx-10 lg:mx-20">
                {/* Logo */}
                <div className="flex items-center text-2xl h-14">
                    <Link href="/">Logo</Link>
                </div>

                {/* Menu button */}
                <div className="text-2xl sm:hidden">
                    {menu === false ? (
                        <button onClick={handleMenu}>+</button>
                    ) : (
                        <button onClick={handleMenu}>-</button>
                    )}
                </div>

                {/* Nav items large screen (Desktop)*/}
                <div className="hidden sm:block">
                    <NavItem />
                </div>
            </div>

            {/* Nav items large screen (Mobile)*/}
            {/* 모바일 화면에서 메뉴가 열렸을 때 표시되는 네비게이션 아이템 */}
            <div className="block sm:hidden">
                {menu === false ? null : <NavItem mobile />}
            </div>
        </nav>
    );
};

export default Navbar;
