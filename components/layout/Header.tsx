"use client";
// Phase 1 — พัฒนาเต็มใน Phase 1
// Placeholder สำหรับ boilerplate

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <span className="font-heading font-bold text-xl text-jolly-navy">
              Jolly Pet
            </span>
          </a>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/products" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              สินค้า
            </a>
            <a href="/about" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              เกี่ยวกับเรา
            </a>
            <a href="/contact" className="font-body text-gray-600 hover:text-jolly-navy transition-colors">
              ติดต่อ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <a href="/cart" className="text-gray-600 hover:text-jolly-navy">
              🛒
            </a>
            <a href="/login" className="btn-secondary text-sm">
              เข้าสู่ระบบ
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
