"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;
  const isAdmin = (user as { userType?: string })?.userType === "admin";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Jolly Pet"
              width={100}
              height={56}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              สินค้า
            </Link>
            <Link href="/about" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              เกี่ยวกับเรา
            </Link>
            <Link href="/contact" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              ติดต่อ
            </Link>
            {isAdmin && (
              <Link href="/admin" className="font-body text-jolly-yellow font-semibold hover:text-jolly-yellow-dark transition-colors">
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/cart" className="text-gray-600 hover:text-jolly-navy text-xl" aria-label="ตะกร้า">
              🛒
            </Link>

            {status === "loading" ? (
              <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-body text-gray-700 hover:text-jolly-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <span className="w-7 h-7 rounded-full bg-jolly-navy text-white text-xs flex items-center justify-center font-heading font-bold flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                  <span className="text-gray-400">▾</span>
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 font-body text-sm">
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-jolly-navy"
                        onClick={() => setMenuOpen(false)}
                      >
                        📦 คำสั่งซื้อของฉัน
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-jolly-navy"
                        onClick={() => setMenuOpen(false)}
                      >
                        👤 ข้อมูลส่วนตัว
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-jolly-yellow font-semibold hover:bg-gray-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-secondary text-sm">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
