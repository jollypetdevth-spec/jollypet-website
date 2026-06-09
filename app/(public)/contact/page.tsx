import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อบริษัท จอลลี่ เพ็ท จำกัด สอบถามสินค้า ราคาส่ง และการเป็นตัวแทนจำหน่าย",
};

const contactItems = [
  { icon: "📍", label: "ที่อยู่", value: "72/93 หมู่ที่ 5 ต.บึงคำพรอย อ.ลำลูกกา จ.ปทุมธานี 12150" },
  { icon: "📞", label: "ติดต่อ", value: "ณฐอร เลาหกุล (นก) 099-324-6629" },
  { icon: "📧", label: "อีเมล", value: "jollypet.hq@gmail.com" },
  { icon: "⏰", label: "เวลาทำการ", value: "จันทร์–ศุกร์ 9:00–18:00 น." },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-jolly-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-heading font-bold text-4xl md:text-5xl">
            ติดต่อ<span className="text-jolly-yellow">เรา</span>
          </h1>
          <p className="font-body text-gray-300 text-lg">
            สอบถามข้อมูลสินค้า ราคาส่ง หรือสนใจเป็นตัวแทนจำหน่าย ติดต่อเราได้เลย
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-bold text-2xl text-jolly-navy mb-6">ข้อมูลติดต่อ</h2>
              <div className="space-y-5">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-heading font-semibold text-jolly-navy text-sm">{item.label}</p>
                      <p className="font-body text-gray-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="font-body text-sm">Google Maps จะแสดงที่นี่</p>
                <a
                  href="https://maps.google.com/?q=72/93+หมู่5+ต.บึงคำพรอย+อ.ลำลูกกา+ปทุมธานี"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-jolly-navy text-sm underline mt-1 inline-block"
                >
                  เปิดใน Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-heading font-bold text-2xl text-jolly-navy mb-6">ส่งข้อความหาเรา</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">ชื่อ *</label>
                  <input type="text" className="input" placeholder="ชื่อของคุณ" required />
                </div>
                <div>
                  <label className="label">นามสกุล</label>
                  <input type="text" className="input" placeholder="นามสกุล" />
                </div>
              </div>
              <div>
                <label className="label">อีเมล *</label>
                <input type="email" className="input" placeholder="email@example.com" required />
              </div>
              <div>
                <label className="label">เบอร์โทรศัพท์</label>
                <input type="tel" className="input" placeholder="0812345678" />
              </div>
              <div>
                <label className="label">หัวข้อ *</label>
                <select className="input" required>
                  <option value="">เลือกหัวข้อ</option>
                  <option value="product">สอบถามสินค้า</option>
                  <option value="wholesale">ราคาส่ง / ตัวแทนจำหน่าย</option>
                  <option value="order">ติดตามคำสั่งซื้อ</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
              <div>
                <label className="label">ข้อความ *</label>
                <textarea
                  className="input resize-none"
                  rows={5}
                  placeholder="รายละเอียดที่ต้องการสอบถาม..."
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-base">
                ส่งข้อความ
              </button>
              <p className="text-xs text-gray-400 text-center font-body">
                เราจะตอบกลับภายใน 1–2 วันทำการ
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
