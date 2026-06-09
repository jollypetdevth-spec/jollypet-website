// Phase 1 — Homepage (placeholder)
// จะพัฒนาเต็มใน Phase 1

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-jolly-navy rounded-full flex items-center justify-center mx-auto">
          <span className="text-jolly-yellow text-4xl">🐾</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-jolly-navy">
          Jolly Pet
        </h1>
        <p className="font-body text-gray-500">
          วัตถุดิบชั้นดี อร่อยง่าย ไม่เค็ม
        </p>
        <p className="text-sm text-gray-400">🚧 กำลังพัฒนา — Coming Soon</p>
      </div>
    </main>
  );
}
