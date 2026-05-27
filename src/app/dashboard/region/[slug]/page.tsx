'use client'
import { useParams } from 'next/navigation'

const REGION_DATA: Record<string, any> = {
  west: { name: 'Баруун бүс', mgr: 'Чинтогтох', key: 'WEST', color: 'bg-purple-100 text-purple-700' },
  east: { name: 'Зүүн бүс', mgr: 'Наранбаатар', key: 'EAST', color: 'bg-green-100 text-green-700' },
  south: { name: 'Урд бүс', mgr: 'Булгантамир', key: 'SOUTH', color: 'bg-amber-100 text-amber-700' },
  center: { name: 'Төв бүс', mgr: 'Баттулга', key: 'CENTER', color: 'bg-blue-100 text-blue-700' },
}

const ALL_CUSTOMERS = [
  { id: 1, name: 'Батбаяр Болд', phone: '99112233', region: 'WEST', totalSpent: 1500000, totalBonus: 60000, usableBonus: 30000 },
  { id: 2, name: 'Дорж Сарнай', phone: '88223344', region: 'EAST', totalSpent: 2500000, totalBonus: 120000, usableBonus: 60000 },
  { id: 3, name: 'Оюун Энхтуяа', phone: '77334455', region: 'CENTER', totalSpent: 5200000, totalBonus: 350000, usableBonus: 175000 },
  { id: 4, name: 'Ганбаатар Нарантуяа', phone: '88441122', region: 'WEST', totalSpent: 800000, totalBonus: 32000, usableBonus: 16000 },
  { id: 5, name: 'Энхбаяр Дэлгэр', phone: '99554433', region: 'SOUTH', totalSpent: 9100000, totalBonus: 700000, usableBonus: 350000 },
]

function getTier(s: number) {
  if (s >= 8000000) return 8
  if (s >= 4000000) return 7
  if (s >= 2000000) return 6
  return 4
}

function fmt(n: number) { return n.toLocaleString() + '₮' }
function initials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2) }

const tierColor: Record<number, string> = {
  4: 'bg-blue-50 text-blue-600',
  6: 'bg-green-50 text-green-600',
  7: 'bg-amber-50 text-amber-600',
  8: 'bg-purple-50 text-purple-600',
}

export default function RegionPage() {
  const params = useParams()
  const slug = params.slug as string
  const r = REGION_DATA[slug]
  if (!r) return <div className="p-8 text-gray-400">Бүс олдсонгүй</div>
  const customers = ALL_CUSTOMERS.filter(c => c.region === r.key)
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0)
  const totalBonus = customers.reduce((s, c) => s + c.totalBonus, 0)
  const totalUsable = customers.reduce((s, c) => s + c.usableBonus, 0)

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
          <a href="/dashboard/region/west" className={`block px-3 py-2 rounded-lg text-sm mb-1 ${slug==='west'?'bg-blue-50 text-blue-600':'text-gray-600 hover:bg-gray-50'}`}>Баруун бүс</a>
          <a href="/dashboard/region/east" className={`block px-3 py-2 rounded-lg text-sm mb-1 ${slug==='east'?'bg-blue-50 text-blue-600':'text-gray-600 hover:bg-gray-50'}`}>Зүүн бүс</a>
          <a href="/dashboard/region/south" className={`block px-3 py-2 rounded-lg text-sm mb-1 ${slug==='south'?'bg-blue-50 text-blue-600':'text-gray-600 hover:bg-gray-50'}`}>Урд бүс</a>
          <a href="/dashboard/region/center" className={`block px-3 py-2 rounded-lg text-sm mb-1 ${slug==='center'?'bg-blue-50 text-blue-600':'text-gray-600 hover:bg-gray-50'}`}>Төв бүс</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Систем</div>
          <a href="/dashboard/products" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Бүтээгдэхүүн</a>
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
          <h1 className="text-sm font-semibold">{r.name}</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-xl border p-4 mb-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${r.color}`}>📍</div>
            <div>
              <div className="text-base font-semibold text-gray-800">{r.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">Менежер: <span className="text-gray-600 font-medium">{r.mgr}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-white rounded-xl border p-4"><div className="text-xl font-semibold text-blue-600">{customers.length}</div><div className="text-xs text-gray-400 mt-1">Хэрэглэгч</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-xl font-semibold text-gray-700">{fmt(totalSpent)}</div><div className="text-xs text-gray-400 mt-1">Нийт зарцуулалт</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-xl font-semibold text-green-600">{totalBonus.toLocaleString()}</div><div className="text-xs text-gray-400 mt-1">Нийт бонус</div></div>
            <div className="bg-white rounded-xl border p-4"><div className="text-xl font-semibold text-purple-600">{totalUsable.toLocaleString()}</div><div className="text-xs text-gray-400 mt-1">Ашиглах боломж</div></div>
          </div>
          <div className="text-xs text-gray-400 uppercase mb-2">Хэрэглэгчдийн жагсаалт</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            {customers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">Энэ бүсэд хэрэглэгч байхгүй</div>
            ) : (
              <table className="w-full">
                <thead><tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium w-8"></th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нэр</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Утас</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Зарцуулалт</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бонус</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Ашиглах</th>
                </tr></thead>
                <tbody>
                  {customers.map(c => {
                    const tier = getTier(c.totalSpent)
                    return (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${r.color}`}>{initials(c.name)}</div></td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{c.phone}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[tier]}`}>{tier}%</span></td>
                        <td className="px-4 py-3 text-sm text-gray-700">{fmt(c.totalSpent)}</td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">{c.totalBonus.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-purple-600 font-medium">{c.usableBonus.toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}