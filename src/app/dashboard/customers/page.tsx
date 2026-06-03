'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'loyaltypro_customers'

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Батбаяр Болд', phone: '99112233', region: 'WEST', totalSpent: 1500000, totalBonus: 60000, usableBonus: 30000 },
  { id: 2, name: 'Дорж Сарнай', phone: '88223344', region: 'EAST', totalSpent: 2500000, totalBonus: 120000, usableBonus: 60000 },
  { id: 3, name: 'Оюун Энхтуяа', phone: '77334455', region: 'CENTER', totalSpent: 5200000, totalBonus: 350000, usableBonus: 175000 },
  ]

const REGIONS: Record<string, string> = {
    WEST: 'Баруун бүс',
    EAST: 'Зүүн бүс',
    SOUTH: 'Урд бүс',
    CENTER: 'Төв бүс',
}

function getTier(s: number) {
    if (s >= 8000000) return 8
    if (s >= 4000000) return 7
    if (s >= 2000000) return 6
    return 4
}

function fmt(n: number) { return n.toLocaleString() + '₮' }

function initials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2)
}

function loadCustomers() {
    if (typeof window === 'undefined') return DEFAULT_CUSTOMERS
    try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_CUSTOMERS
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState(DEFAULT_CUSTOMERS)
    const [search, setSearch] = useState('')
    const [region, setRegion] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [detail, setDetail] = useState<any>(null)
    const [form, setForm] = useState({ last: '', first: '', phone: '', region: '' })
    const [err, setErr] = useState('')

  useEffect(() => {
        setCustomers(loadCustomers())
  }, [])

  useEffect(() => {
        if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
        }
  }, [customers])

  const filtered = customers.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false
        if (region && c.region !== region) return false
        return true
  })

  function addCustomer() {
        setErr('')
        if (!form.last || !form.first) { setErr('Нэр оруулна уу'); return }
        if (form.phone.length !== 8) { setErr('8 оронтой утас оруулна уу'); return }
        if (!form.region) { setErr('Бүс сонгоно уу'); return }
        if (customers.find(c => c.phone === form.phone)) { setErr('Энэ дугаар бүртгэлтэй байна'); return }
        const newC = { id: Date.now(), name: form.last + ' ' + form.first, phone: form.phone, region: form.region, totalSpent: 0, totalBonus: 0, usableBonus: 0 }
        setCustomers(p => [...p, newC])
        setForm({ last: '', first: '', phone: '', region: '' })
        setShowAdd(false)
  }

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
                                <div className="font-semibold text-sm">🏆 LoyaltyPro</div>div>
                                <div className="text-xs text-gray-400 mt-1">Бонус удирдлага</div>div>
                      </div>div>
                      <nav className="p-2 flex-1">
                                <div className="text-xs text-gray-400 px-2 py-2 uppercase">Үндсэн</div>div>
                                <a href="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хяналтын самбар</a>a>
                                <a href="/dashboard/sale" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Борлуулалт</a>a>
                                <a href="/dashboard/customers" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Хэрэглэгчид</a>a>
                                <a href="/dashboard/transactions" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Гүйлгээ</a>a>
                                <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Бүс нутаг</div>div>
                                <a href="/dashboard/region/west" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Баруун бүс</a>a>
                                <a href="/dashboard/region/east" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Зүүн бүс</a>a>
                                <a href="/dashboard/region/south" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Урд бүс</a>a>
                                <a href="/dashboard/region/center" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Төв бүс</a>a>
                                <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Систем</div>div>
                                <a href="/dashboard/products" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Бүтээгдэхүүн</a>a>
                                <a href="/dashboard/reports" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Тайлан</a>a>
                      </nav>nav>
                      <div className="p-3 border-t flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">АД</div>div>
                                <div>
                                            <div className="text-xs font-semibold text-gray-700">Администратор</div>div>
                                            <div className="text-xs text-gray-400">Супер админ</div>div>
                                </div>div>
                      </div>div>
              </aside>aside>
        
              <main className="flex-1 flex flex-col overflow-hidden">
                      <header className="h-12 bg-white border-b flex items-center justify-between px-6">
                                <h1 className="text-sm font-semibold">Хэрэглэгчид</h1>h1>
                                <button onClick={() => setShowAdd(true)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ Хэрэглэгч нэмэх</button>button>
                      </header>header>
              
                      <div className="flex-1 overflow-y-auto p-4">
                                <div className="flex gap-3 mb-4">
                                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Нэр эсвэл утасны дугаараар хайх..." className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-400"/>
                                            <select value={region} onChange={e => setRegion(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                                                          <option value="">Бүх бүс</option>option>
                                              {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>option>)}
                                            </select>select>
                                </div>div>
                      
                                <div className="bg-white rounded-xl border overflow-hidden">
                                            <table className="w-full">
                                                          <thead>
                                                                          <tr className="border-b bg-gray-50">
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium w-8"></th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нэр</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Утас</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бүс</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Tier</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Зарцуулалт</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бонус</th>th>
                                                                                            <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Ашиглах</th>th>
                                                                          </tr>tr>
                                                          </thead>thead>
                                                          <tbody>
                                                            {filtered.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">Хэрэглэгч олдсонгүй</td>td></tr>tr>
                          ) : filtered.map(c => {
                            const tier = getTier(c.totalSpent)
                                                return (
                                                                      <tr key={c.id} onClick={() => setDetail(c)} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer">
                                                                                            <td className="px-4 py-3">
                                                                                                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">{initials(c.name)}</div>div>
                                                                                              </td>td>
                                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.name}</td>td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-500">{c.phone}</td>td>
                                                                                            <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{REGIONS[c.region]}</span>span></td>td>
                                                                                            <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[tier]}`}>{tier}%</span>span></td>td>
                                                                                            <td className="px-4 py-3 text-sm text-gray-700">{fmt(c.totalSpent)}</td>td>
                                                                                            <td className="px-4 py-3 text-sm text-green-600 font-medium">{c.totalBonus.toLocaleString()}</td>td>
                                                                                            <td className="px-4 py-3 text-sm text-purple-600 font-medium">{c.usableBonus.toLocaleString()}</td>td>
                                                                      </tr>tr>
                                                                    )
                                                            })}
                                                          </tbody>tbody>
                                            </table>table>
                                </div>div>
                      </div>div>
              </main>main>
        
          {showAdd && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl border p-6 w-80">
                                        <div className="flex justify-between items-center mb-4">
                                                      <h2 className="text-sm font-semibold">Хэрэглэгч нэмэх</h2>h2>
                                                      <button onClick={() => { setShowAdd(false); setErr('') }} className="text-gray-400 hover:text-gray-600">✕</button>button>
                                        </div>div>
                                        <div className="space-y-3">
                                                      <div>
                                                                      <label className="text-xs text-gray-500">Овог</label>label>
                                                                      <input value={form.last} onChange={e => setForm(f => ({ ...f, last: e.target.value }))} placeholder="Батбаяр" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
                                                      </div>div>
                                                      <div>
                                                                      <label className="text-xs text-gray-500">Нэр</label>label>
                                                                      <input value={form.first} onChange={e => setForm(f => ({ ...f, first: e.target.value }))} placeholder="Болд" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
                                                      </div>div>
                                                      <div>
                                                                      <label className="text-xs text-gray-500">Утасны дугаар</label>label>
                                                                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 8) }))} placeholder="99112233" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
                                                      </div>div>
                                                      <div>
                                                                      <label className="text-xs text-gray-500">Бүс нутаг</label>label>
                                                                      <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none">
                                                                                        <option value="">— Сонгох —</option>option>
                                                                        {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>option>)}
                                                                      </select>select>
                                                      </div>div>
                                          {err && <p className="text-red-500 text-xs">{err}</p>p>}
                                                      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">Шинэ хэрэглэгч 4% tier-ээс эхэлнэ</div>div>
                                        </div>div>
                                        <div className="flex gap-2 mt-4">
                                                      <button onClick={() => { setShowAdd(false); setErr('') }} className="flex-1 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Болих</button>button>
                                                      <button onClick={addCustomer} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Нэмэх</button>button>
                                        </div>div>
                            </div>div>
                  </div>div>
              )}
        
          {detail && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl border p-6 w-96">
                                        <div className="flex justify-between items-center mb-4">
                                                      <h2 className="text-sm font-semibold">Хэрэглэгчийн мэдээлэл</h2>h2>
                                                      <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">✕</button>button>
                                        </div>div>
                                        <div className="flex items-center gap-3 mb-4">
                                                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-semibold">{initials(detail.name)}</div>div>
                                                      <div>
                                                                      <div className="font-semibold text-gray-800">{detail.name}</div>div>
                                                                      <div className="text-xs text-gray-400">{detail.phone} · {REGIONS[detail.region]}</div>div>
                                                      </div>div>
                                                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${tierColor[getTier(detail.totalSpent)]}`}>{getTier(detail.totalSpent)}% tier</span>span>
                                        </div>div>
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                      <div className="bg-gray-50 rounded-lg p-3">
                                                                      <div className="text-sm font-semibold text-gray-700">{fmt(detail.totalSpent)}</div>div>
                                                                      <div className="text-xs text-gray-400 mt-1">Нийт зарцуулалт</div>div>
                                                      </div>div>
                                                      <div className="bg-gray-50 rounded-lg p-3">
                                                                      <div className="text-sm font-semibold text-green-600">{detail.totalBonus.toLocaleString()}</div>div>
                                                                      <div className="text-xs text-gray-400 mt-1">Нийт бонус</div>div>
                                                      </div>div>
                                                      <div className="bg-gray-50 rounded-lg p-3">
                                                                      <div className="text-sm font-semibold text-purple-600">{detail.usableBonus.toLocaleString()}</div>div>
                                                                      <div className="text-xs text-gray-400 mt-1">Ашиглах боломж (50%)</div>div>
                                                      </div>div>
                                                      <div className="bg-gray-50 rounded-lg p-3">
                                                                      <div className="text-sm font-semibold text-gray-700">{getTier(detail.totalSpent)}%</div>div>
                                                                      <div className="text-xs text-gray-400 mt-1">Одоогийн tier</div>div>
                                                      </div>div>
                                        </div>div>
                                        <button onClick={() => setDetail(null)} className="w-full py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Хаах</button>button>
                            </div>div>
                  </div>div>
              )}
        </div>div>
      )
}</div>
