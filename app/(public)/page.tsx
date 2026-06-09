import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/product/ProductCard";
import { getFeaturedProducts, categories, categoryEmoji } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Jolly Pet — วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม",
  description:
    "ผลิตภัณฑ์อาหาร ขนม และของใช้สำหรับสัตว์เลี้ยงคุณภาพสูง จากบริษัท จอลลี่ เพ็ท จำกัด วัตถุดิบชั้นดี Human Grade ผลิตในไทย",
  openGraph: {
    title: "Jolly Pet — วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม",
    description: "ผลิตภัณฑ์สำหรับสัตว์เลี้ยงคุณภาพสูง Human Grade ผลิตในไทย",
    url: "https://jollypet.co.th",
  },
};

const trustItems = [
  { icon: "🏆", title: "Human Grade", desc: "วัตถุดิบคุณภาพระดับอาหารคน" },
  { icon: "🇹🇭", title: "Made in Thailand", desc: "ผลิตในประเทศไทย 100%" },
  { icon: "🧪", title: "ไม่มีสารอันตราย", desc: "ปราศจาก Paraben & SLS" },
  { icon: "🐾", title: "Pet Safe", desc: "ปลอดภัยต่อสัตว์เลี้ยงทุกวัย" },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-jolly-navy text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <span className="inline-block bg-jolly-yellow/20 text-jolly-yellow text-sm font-medium px-4 py-1.5 rounded-full">
            🐾 วัตถุดิบชั้นดี Human Grade
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight">
            อร่อยง่าย <span className="text-jolly-yellow">ไม่เค็ม</span>
            <br />
            เพื่อสัตว์เลี้ยงที่คุณรัก
          </h1>
          <p className="font-body text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Jolly Pet คัดสรรวัตถุดิบชั้นดีระดับ Human Grade ผลิตในประเทศไทย
            เพื่อสุขภาพที่ดีของสัตว์เลี้ยงทุกตัว
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/products" className="btn-primary text-lg px-8 py-3">
              ดูสินค้าทั้งหมด
            </Link>
            <Link href="/about" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white/10">
              เกี่ยวกับเรา
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-jolly-navy">หมวดหมู่สินค้า</h2>
            <p className="font-body text-gray-500 mt-2">ครบครันทุกความต้องการของสัตว์เลี้ยงคุณ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group card p-8 text-center hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="text-5xl mb-4">{categoryEmoji[cat.slug] ?? "📦"}</div>
                <h3 className="font-heading font-bold text-xl text-jolly-navy mb-2 group-hover:text-jolly-yellow transition-colors">
                  {cat.name}
                </h3>
                <p className="font-body text-sm text-gray-500">{cat.description}</p>
                <span className="inline-block mt-4 text-sm font-medium text-jolly-navy group-hover:underline">
                  ดูสินค้า →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-heading font-bold text-3xl text-jolly-navy">สินค้าแนะนำ</h2>
              <p className="font-body text-gray-500 mt-1">คัดพิเศษมาให้คุณและสัตว์เลี้ยง</p>
            </div>
            <Link href="/products" className="btn-outline text-sm hidden sm:inline-flex">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/products" className="btn-outline">
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className="py-16 px-4 bg-jolly-navy/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6">
            <span className="text-sm font-medium text-jolly-navy bg-jolly-yellow/30 px-3 py-1 rounded-full">
              เกี่ยวกับ Jolly Pet
            </span>
            <h2 className="font-heading font-bold text-3xl text-jolly-navy leading-snug">
              เราใส่ใจทุกวัตถุดิบ
              <br />
              เพราะเราเข้าใจความรัก
              <br />
              ที่คุณมีต่อสัตว์เลี้ยง
            </h2>
            <p className="font-body text-gray-600 leading-relaxed">
              บริษัท จอลลี่ เพ็ท จำกัด ก่อตั้งขึ้นด้วยความมุ่งมั่นในการผลิตสินค้าสำหรับสัตว์เลี้ยง
              ที่ใช้วัตถุดิบชั้นดีระดับ Human Grade โดยทีมงานที่มีความรักและเข้าใจสัตว์เลี้ยงอย่างแท้จริง
            </p>
            <p className="font-body text-gray-600 leading-relaxed">
              ผลิตภัณฑ์ทุกชิ้นของเราผ่านการคัดสรรวัตถุดิบอย่างพิถีพิถัน
              ไม่มีสารเคมีอันตราย และผลิตในประเทศไทย 100%
              เพื่อให้คุณมั่นใจได้ว่าสัตว์เลี้ยงของคุณได้รับสิ่งที่ดีที่สุด
            </p>
            <Link href="/about" className="btn-secondary inline-flex">
              อ่านเพิ่มเติม
            </Link>
          </div>

          {/* Visual */}
          <div className="bg-jolly-yellow/20 rounded-2xl aspect-square flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-8xl">🐾</div>
              <p className="font-heading font-bold text-jolly-navy text-xl">Jolly Pet Family</p>
              <p className="font-body text-gray-500 text-sm">วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="text-center space-y-2">
                <div className="text-4xl">{item.icon}</div>
                <h4 className="font-heading font-semibold text-jolly-navy">{item.title}</h4>
                <p className="font-body text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="bg-jolly-navy py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-heading font-bold text-3xl">
            สนใจสั่งซื้อหรือเป็นตัวแทนจำหน่าย?
          </h2>
          <p className="font-body text-gray-300">
            ติดต่อทีมงาน Jolly Pet เพื่อรับข้อมูลราคาส่ง สินค้าใหม่ และโปรโมชั่นพิเศษ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg px-8 py-3">
              ติดต่อเรา
            </Link>
            <Link href="/register" className="border-2 border-white text-white font-heading font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-jolly-navy transition-colors text-lg">
              สมัครเป็นตัวแทน
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
