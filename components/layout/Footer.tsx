import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-jolly-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/logo.svg"
              alt="Jolly Pet"
              width={120}
              height={68}
              className="h-16 w-auto mb-3"
            />
            <p className="font-body text-gray-300 text-sm leading-relaxed">
              วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม
              <br />
              บริษัท จอลลี่ เพ็ท จำกัด
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">สินค้า</h4>
            <ul className="space-y-2 text-sm text-gray-300 font-body">
              <li><a href="/products?category=dog-snack" className="hover:text-jolly-yellow transition-colors">Dog Snack</a></li>
              <li><a href="/products?category=pet-care" className="hover:text-jolly-yellow transition-colors">Pet Care</a></li>
              <li><a href="/products?category=home-care" className="hover:text-jolly-yellow transition-colors">Home Care</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-3">ติดต่อ</h4>
            <ul className="space-y-2 text-sm text-gray-300 font-body">
              <li>72/93 หมู่ที่ 5 ต.บึงคำพรอย</li>
              <li>อ.ลำลูกกา จ.ปทุมธานี 12150</li>
              <li className="pt-1">
                <a href="tel:0993246629" className="hover:text-jolly-yellow transition-colors">
                  099-324-6629 (นก)
                </a>
              </li>
              <li>
                <a href="mailto:jollypet.hq@gmail.com" className="hover:text-jolly-yellow transition-colors">
                  jollypet.hq@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-400 font-body">
          © {new Date().getFullYear()} บริษัท จอลลี่ เพ็ท จำกัด. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
