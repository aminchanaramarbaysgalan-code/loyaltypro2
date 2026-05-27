'use client'

const PRODUCTS = [
  { id: 1, name: 'Хөх', price: 360000 },
  { id: 2, name: 'Улаан', price: 220000 },
  { id: 3, name: 'Желатин', price: 200000 },
  { id: 4, name: 'Хүүхэд', price: 100000 },
  { id: 5, name: 'Ногоон', price: 280000 },
]

const TIERS = [
  { pct: 4, label: '4%', range: '0 — 1,999,999₮', desc: 'Шинэ хэрэглэгч', color: 'bg-blue-50 text-blue-600' },
  { pct: 6, label: '6%', range: '2,000,000 — 3,999,999₮', desc: 'Хөнгөлөлтийн tier', color: 'bg-green-50 text-green-600' },
  { pct: 7, label: '7%', range: '4,000,000 — 7,999,999₮', desc: 'Тогтмол хэрэглэгч', color: 'bg-amber-50 text-amber-600' },
  { pct: 8, label: '8%', range: '8,000,000₮+', desc: 'VIP хэрэглэгч', color: 'bg-purple-50 text-purple-600' },
]

function fmt(n: number) { return n.toLocaleString() + '₮' }

export default function ProductsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r flex flex-col flex-shrink-0">
        <div className="p-4 border-b">
          <div className="font-semibold text-sm">🏆 LoyaltyPro</div>
          <div className="text-xs text-gray-400 mt-1">Бонус удирдлага</div>
        </div>
        <nav className="p-2 flex-1">
          <div className="text-xs text-gray-400 px-2 py-2 uppercase">Үндсэн</div>
          <a href="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хяналтын самбар</a>
          <a href="/dashboard/sale" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Борлуулалт</a>
          <a href="/dashboard/customers" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хэрэглэгчид</a>
          <a href="/dashboard/transactions" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Гүйлгээ</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Бүс нутаг</div>
          <a href="/dashboard/region/west" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Баруун бүс</a>
          <a href="/dashboard/region/east" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Зүүн бүс</a>
          <a href="/dashboard/region/south" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Урд бүс</a>
          <a href="/dashboard/region/center" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Төв бүс</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Систем</div>
          <a href="/dashboard/products" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Бүтээгдэхүүн</a>
          <a href="/dashboard/reports" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Тайлан</a>
        </nav>
        <div className="p-3 border-t flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">АД</div>
          <div>
            <div className="text-xs font-semibold text-gray-700">Администратор</div>
            <div className="text-xs text-gray-400">Супер админ</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-white border-b flex items-center px-6">
          <h1 className="text-sm font-semibold">Бүтээгдэхүүн</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs text-gray-400 uppercase mb-2">Бүтээгдэхүүний жагсаалт</div>
          <div className="bg-white rounded-xl border overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">#</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бүтээгдэхүүн</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Үнэ</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">4% бонус</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">6% бонус</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">7% бонус</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">8% бонус</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p, i) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{fmt(p.price)}</td>
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{Math.floor(p.price * 0.04).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-medium">{Math.floor(p.price * 0.06).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-amber-600 font-medium">{Math.floor(p.price * 0.07).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-purple-600 font-medium">{Math.floor(p.price * 0.08).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-400 uppercase mb-2">Tier дэвших шаардлага</div>
          <div className="bg-white rounded-xl border overflow-hidden mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нийт зарцуулалт</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бонус хувь</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Тайлбар</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map(t => (
                  <tr key={t.pct} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.label}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.range}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{t.pct}%</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-400 uppercase mb-2">Бонус дүрэм</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">Бонус тооцоолол</div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Бонус = Үнэ × Tier хувь</p>
                <p>• Жишээ: 360,000₮ × 4% = 14,400 бонус</p>
                <p>• Tier нь одоогийн нийт зарцуулалтаас тодорхойлогдоно</p>
                <p>• Тухайн худалдааны дараа tier шинэчлэгдэнэ</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">Бонус ашиглах дүрэм</div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Нийт бонусын зөвхөн <span className="text-purple-600 font-semibold">50%</span>-ийг ашиглах боломжтой</p>
                <p>• Жишээ: 40,000 бонус → 20,000 ашиглах боломжтой</p>
                <p>• Ашигласан бонус нийт бонусаас хасагдана</p>
                <p>• Ашиглах боломж дахин тооцоологдоно</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}