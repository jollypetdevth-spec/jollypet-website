"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-2xl text-jolly-navy">เข้าสู่ระบบ</h1>
          <p className="font-body text-gray-500 mt-1 text-sm">
            ยินดีต้อนรับกลับมา
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">อีเมล</label>
            <input
              type="email"
              className="input"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">รหัสผ่าน</label>
              <Link href="/forgot-password" className="text-xs text-jolly-navy hover:underline font-body">
                ลืมรหัสผ่าน?
              </Link>
            </div>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-base"
            disabled={loading}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 font-body mt-6">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-jolly-navy font-medium hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </div>

      {/* Wholesale hint */}
      <div className="mt-4 bg-jolly-yellow/10 border border-jolly-yellow/30 rounded-xl p-4 text-sm font-body text-center">
        <p className="text-gray-700">
          🏪 <strong>ลูกค้าส่ง (B2B)</strong> — สมัครบัญชีประเภทร้านค้า
          เพื่อดูราคาพิเศษและโปรโมชั่นสำหรับผู้จัดจำหน่าย
        </p>
      </div>
    </div>
  );
}
