'use client'
import { useState } from 'react'

const REGIONS: Record<string, string> = {
  WEST: 'Баруун бүс', EAST: 'Зүүн бүс', SOUTH: 'Урд бүс', CENTER: 'Төв бүс',
}

function fmt(n: number) { return n.toLocaleString() + '₮' }

const INIT_TXS = [
  { id: 1, name: 'Батбаяр Болд', phone: '99112233', region: 'WEST', prod: 'Улаан', amt: 220000, pct: 4, earned: 8800, used: 0, date: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 2, name: 'Оюун Энхтуяа', phone: '77334455', region: 'CENTER', prod: 'Хөх', amt: 360000, pct: 7, earned: 25200, used: 0, date: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 3, name: 'Дорж Сарнай', phone: '88223344', region: 'EAST', prod: 'Желатин', amt: 200000, pct: 6, earned: 12000, used: 20000, date: new Date(Date.now() - 1000 * 60 * 60 * 24) },
]

const DAYS = ['Ням', 'Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям']

function fmtDate(d: Date) {
  return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

function groupByDate(txs: any[]) {
  const groups: Record<string, any[]> = {}
  txs.forEach(t => {
    const key = t.date.toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  })
  return groups
}

export default function TransactionsPage() {
  const [txs] = useState(INIT_TXS)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [view, setView] = useState<'table' | 'user'>('table')

  const filtered = txs.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.phone.includes(search)) return false
    if (type === 'earned' && t.earned === 0) return false
    if (type === 'used' && t.used === 0) return false
    return true
  })

  const totalEarned = txs.reduce((s, t) => s + t.earned, 0)
  const totalUsed = txs.reduce((s, t) => s + t.used, 0)
  const groups = groupByDate(filtered)

  const tierColor: Record<number, string> = {
    4: 'bg-blue-50 text-blue-600',
    6: 'bg-green-50 text-green-600',
    7: 'bg-amber-50 text-amber-600',
    8: 'bg-purple-50 text-purple-600',
  }

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
          <a href="/dashboard/transactions" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Гүйлгээ</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Бүс нутаг</div>
          <a href="/dashboard/region/west" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Баруун бүс</a>
          <a href="/dashboard/region/east" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Зүүн бүс</a>
          <a href="/dashboard/region/south" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Урд бүс</a>
          <a href="/dashboard/region/center" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Төв бүс</a>
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
        <header className="h-12 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold">Гүйлгээний түүх</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-blue-600">{txs.length}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт гүйлгээ</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-green-600">{totalEarned.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт хуримтлагдсан бонус</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-purple-600">{totalUsed.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт ашигласан бонус</div>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Нэр эсвэл утас хайх..." className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-400"/>
            <select value={type} onChange={e => setType(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white outline-none">
              <option value="">Бүх төрөл</option>
              <option value="earned">Хуримтлагдсан</option>
              <option value="used">Ашигласан</option>
            </select>
            <div className="flex border rounded-lg overflow-hidden bg-white">
              <button onClick={() => setView('table')} className={`px-4 py-2 text-sm ${view === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Хүснэгт</button>
              <button onClick={() => setView('user')} className={`px-4 py-2 text-sm ${view === 'user' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Хэрэглэгчээр</button>
            </div>
          </div>

          {view === 'table' ? (
            <div className="bg-white rounded-xl border overflow-hidden">
              {Object.entries(groups).map(([key, items]) => (
                <div key={key}>
                  <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-400 font-medium">
                    {(() => { const d = items[0].date; return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0') + ' (' + DAYS[d.getDay()] + ') — ' + items.length + ' гүйлгээ' })()}
                  </div>
                  <table className="w-full">
                    <tbody>
                      {items.map((t, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-3 w-8">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">{t.name.split(' ').map((w: string) => w[0]).join('').slice(0,2)}</div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{t.phone}</td>
                          <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t.prod}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">{fmt(t.amt)}</td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[t.pct]}`}>{t.pct}%</span></td>
                          <td className="px-4 py-3 text-sm text-green-600 font-medium">+{t.earned.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-purple-600 font-medium">{t.used > 0 ? '-' + t.used.toLocaleString() : '—'}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(t.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
              {filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Гүйлгээ олдсонгүй</div>}
            </div>
          ) : (
            <div className="space-y-3">
              {[...new Set(filtered.map(t => t.phone))].map(phone => {
                const uTxs = filtered.filter(t => t.phone === phone)
                const u = uTxs[0]
                const totalE = uTxs.reduce((s, t) => s + t.earned, 0)
                const totalU = uTxs.reduce((s, t) => s + t.used, 0)
                return (
                  <div key={phone} className="bg-white rounded-xl border overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">{u.name.split(' ').map((w: string) => w[0]).join('').slice(0,2)}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.phone} · {REGIONS[u.region]}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">+{totalE.toLocaleString()}</span>
                        {totalU > 0 && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">-{totalU.toLocaleString()}</span>}
                        <span className="text-xs text-gray-400">{uTxs.length} гүйлгээ</span>
                      </div>
                    </div>
                    {uTxs.map((t, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-2 border-b last:border-0 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t.prod}</span>
                          <span className="text-sm text-gray-600">{fmt(t.amt)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[t.pct]}`}>{t.pct}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-600 font-medium">+{t.earned.toLocaleString()}</span>
                          {t.used > 0 && <span className="text-sm text-purple-600 font-medium">-{t.used.toLocaleString()}</span>}
                          <span className="text-xs text-gray-400">{fmtDate(t.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
              {filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border">Гүйлгээ олдсонгүй</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}