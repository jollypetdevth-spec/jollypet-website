"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type UserTypeOption = "retail" | "wholesale";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserTypeOption>("retail");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    company_name: "",
    tax_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (form.password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        user_type: userType,
        company_name: userType === "wholesale" ? form.company_name : undefined,
        tax_id: userType === "wholesale" ? form.tax_id : undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      return;
    }

    // Auto sign in after register
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      // Registered but couldn't auto-login → redirect to login
      router.push("/login?registered=1");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-2xl text-jolly-navy">สมัครสมาชิก</h1>
          <p className="font-body text-gray-500 mt-1 text-sm">
            เลือกประเภทบัญชีที่ต้องการ
          </p>
        </div>

        {/* User type toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setUserType("retail")}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              userType === "retail"
                ? "border-jolly-navy bg-jolly-navy text-white"
                : "border-gray-200 hover:border-jolly-navy/40"
            }`}
          >
            <div className="text-2xl mb-1">🛒</div>
            <div className="font-heading font-semibold text-sm">ลูกค้าทั่วไป</div>
            <div className={`text-xs mt-0.5 font-body ${userType === "retail" ? "text-white/80" : "text-gray-400"}`}>
              ซื้อสินค้าราคาปลีก
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUserType("wholesale")}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              userType === "wholesale"
                ? "border-jolly-navy bg-jolly-navy text-white"
                : "border-gray-200 hover:border-jolly-navy/40"
            }`}
          >
            <div className="text-2xl mb-1">🏪</div>
            <div className="font-heading font-semibold text-sm">ร้านค้า / ตัวแทน</div>
            <div className={`text-xs mt-0.5 font-body ${userType === "wholesale" ? "text-white/80" : "text-gray-400"}`}>
              ราคาส่งพิเศษ
            </div>
          </button>
        </div>

        {/* Wholesale notice */}
        {userType === "wholesale" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm font-body text-amber-800 mb-6">
            ⏳ บัญชีประเภทร้านค้าต้องผ่านการอนุมัติก่อน (1–2 วันทำการ) จึงจะดูราคาส่งได้
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">ชื่อ-นามสกุล *</label>
            <input
              type="text"
              name="full_name"
              className="input"
              placeholder="กรอกชื่อ-นามสกุล"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">อีเมล *</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              className="input"
              placeholder="0812345678"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Wholesale extra fields */}
          {userType === "wholesale" && (
            <>
              <div>
                <label className="label">ชื่อร้าน / บริษัท *</label>
                <input
                  type="text"
                  name="company_name"
                  className="input"
                  placeholder="ชื่อร้านหรือบริษัท"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">เลขประจำตัวผู้เสียภาษี</label>
                <input
                  type="text"
                  name="tax_id"
                  className="input"
                  placeholder="13 หลัก (ถ้ามี)"
                  value={form.tax_id}
                  onChange={handleChange}
                  maxLength={13}
                />
              </div>
            </>
          )}

          <div>
            <label className="label">รหัสผ่าน *</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="label">ยืนยันรหัสผ่าน *</label>
            <input
              type="password"
              name="confirm_password"
              className="input"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              value={form.confirm_password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-base mt-2"
            disabled={loading}
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 font-body mt-6">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="text-jolly-navy font-medium hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
