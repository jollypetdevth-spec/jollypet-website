import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description:
    "บริษัท จอลลี่ เพ็ท จำกัด ผู้ผลิตสินค้าสัตว์เลี้ยงคุณภาพสูง Human Grade ผลิตในประเทศไทย",
};

const values = [
  {
    icon: "🏆",
    title: "คุณภาพระดับ Human Grade",
    desc: "เราใช้วัตถุดิบที่ผ่านมาตรฐานอาหารมนุษย์ เพราะเชื่อว่าสัตว์เลี้ยงของคุณสมควรได้รับสิ่งที่ดีที่สุด",
  },
  {
    icon: "🇹🇭",
    title: "ผลิตในประเทศไทย",
    desc: "โรงงานผลิตตั้งอยู่ในจังหวัดปทุมธานี ภายใต้การควบคุมคุณภาพอย่างเข้มงวดทุกขั้นตอน",
  },
  {
    icon: "💚",
    title: "ปลอดภัย ไม่มีสารอันตราย",
    desc: "ปราศจาก Paraben, SLS และสารเคมีอันตรายทุกชนิด เพื่อความปลอดภัยของสัตว์เลี้ยงและครอบครัวคุณ",
  },
  {
    icon: "🔬",
    title: "ผ่านการทดสอบ",
    desc: "ผลิตภัณฑ์ทุกชิ้นผ่านการทดสอบและตรวจสอบคุณภาพก่อนออกจากโรงงาน",
  },
];

const products = [
  { name: "Dog Snack", desc: "ขนมสุนัขคุณภาพสูง โปรตีนสูง ไขมันต่ำ", emoji: "🦴" },
  { name: "Pet Care", desc: "แชมพู โลชั่น และผลิตภัณฑ์ดูแลสุขภาพสัตว์เลี้ยง", emoji: "🛁" },
  { name: "Home Care", desc: "สเปรย์และน้ำยาทำความสะอาด ปลอดภัยต่อสัตว์เลี้ยง", emoji: "🏠" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-jolly-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-heading font-bold text-4xl md:text-5xl">
            เกี่ยวกับ <span className="text-jolly-yellow">Jolly Pet</span>
          </h1>
          <p className="font-body text-gray-300 text-lg max-w-2xl mx-auto">
            เราเชื่อว่าสัตว์เลี้ยงทุกตัวสมควรได้รับสิ่งที่ดีที่สุด
            นั่นคือจุดเริ่มต้นของ Jolly Pet
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-jolly-yellow/15 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl mb-3">🐾</div>
              <p className="font-heading font-semibold text-jolly-navy">บริษัท จอลลี่ เพ็ท จำกัด</p>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="font-heading font-bold text-3xl text-jolly-navy">เรื่องราวของเรา</h2>
            <p className="font-body text-gray-600 leading-relaxed">
              บริษัท จอลลี่ เพ็ท จำกัด ก่อตั้งขึ้นด้วยความรักและความห่วงใยต่อสัตว์เลี้ยง
              โดยทีมผู้เชี่ยวชาญที่เล็งเห็นถึงความสำคัญของโภชนาการและสุขภาพของสัตว์เลี้ยง
            </p>
            <p className="font-body text-gray-600 leading-relaxed">
              เราเริ่มต้นจากความต้องการสร้างผลิตภัณฑ์ที่ใช้วัตถุดิบชั้นดีระดับ Human Grade
              ที่เจ้าของสัตว์เลี้ยงสามารถไว้วางใจได้ว่าปลอดภัยและมีคุณประโยชน์
              อร่อยจนสัตว์เลี้ยงชอบ แต่ไม่เค็มจนเกินไป
            </p>
            <p className="font-body text-gray-600 leading-relaxed">
              ปัจจุบันเราผลิตสินค้าครอบคลุม 3 หมวดหมู่หลัก ได้แก่ Dog Snack, Pet Care และ Home Care
              ทุกผลิตภัณฑ์ผลิตในโรงงานมาตรฐานที่จังหวัดปทุมธานี ภายใต้การดูแลอย่างใกล้ชิด
            </p>
            <div className="bg-jolly-navy/5 rounded-xl p-4 border-l-4 border-jolly-yellow">
              <p className="font-heading font-semibold text-jolly-navy italic">
                "วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม"
              </p>
              <p className="text-sm text-gray-500 mt-1 font-body">— พันธกิจของ Jolly Pet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-jolly-navy">คุณค่าที่เราให้ความสำคัญ</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 shadow-sm text-center space-y-3">
                <div className="text-4xl">{v.icon}</div>
                <h3 className="font-heading font-semibold text-jolly-navy">{v.title}</h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Lines */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-jolly-navy">กลุ่มผลิตภัณฑ์</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.name} className="card p-8 text-center space-y-3">
                <div className="text-5xl">{p.emoji}</div>
                <h3 className="font-heading font-bold text-xl text-jolly-navy">{p.name}</h3>
                <p className="font-body text-gray-600 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="py-14 px-4 bg-jolly-navy text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="font-heading font-bold text-2xl">ที่ตั้งบริษัท</h2>
          <p className="font-body text-gray-300 text-lg">
            72/93 หมู่ที่ 5 ต.บึงคำพรอย อ.ลำลูกกา จ.ปทุมธานี 12150
          </p>
          <p className="font-body text-gray-400 text-sm">
            เลขประจำตัวผู้เสียภาษี: (จะเพิ่มเมื่อได้รับ)
          </p>
          <a href="/contact" className="btn-primary inline-block mt-4">
            ติดต่อเรา
          </a>
        </div>
      </section>
    </>
  );
}
