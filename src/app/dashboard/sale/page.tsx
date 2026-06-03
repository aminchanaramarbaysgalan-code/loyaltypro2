'use client'
import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'loyaltypro_customers'

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Батбаяр Болд', phone: '99112233', region: 'WEST', totalSpent: 1500000, totalBonus: 60000, usableBonus: 30000 },
  { id: 2, name: 'Дорж Сарнай', phone: '88223344', region: 'EAST', totalSpent: 2500000, totalBonus: 120000, usableBonus: 60000 },
  { id: 3, name: 'Оюун Энхтуяа', phone: '77334455', region: 'CENTER', totalSpent: 5200000, totalBonus: 350000, usableBonus: 175000 },
  ]

const PRODUCTS = [
  { id: 1, name: 'Хөх', price: 360000 },
  { id: 2, name: 'Улаан', price: 220000 },
  { id: 3, name: 'Желатин', price: 200000 },
  { id: 4, name: 'Хүүхэд', price: 100000 },
  { id: 5, name: 'Ногоон', price: 280000 },
  ]

function getTier(s: number) {
    if (s >= 8000000) return 8
    if (s >= 4000000) return 7
    if (s >= 2000000) return 6
    return 4
}

function fmt(n: number) { return n.toLocaleString() + '₮' }

function loadCustomers() {
    if (typeof window === 'undefined') return DEFAULT_CUSTOMERS
    try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_CUSTOMERS
}

export default function SalePage() {
    const [phone, setPhone] = useState('')
    const [customer, setCustomer] = useState<any>(null)
    const [notFound, setNotFound] = useState(false)
    const [prodId, setProdId] = useState('')
    const [useBonus, setUseBonus] = useState(0)
    const [todayTxs, setTodayTxs] = useState<any[]>([])
    const [customers, setCustomers] = useState<any[]>(DEFAULT_CUSTOMERS)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
        setCustomers(loadCustomers())
  }, [])

  useEffect(() => {
        const handleClick = (e: MouseEvent) => {
                if (suggestRef.current && !suggestRef.current.contains(e.target as Node) &&
                              inputRef.current && !inputRef.current.contains(e.target as Node)) {
                          setShowSuggestions(false)
                }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const prod = PRODUCTS.find(p => p.id === parseInt(prodId))
    const tier = customer ? getTier(customer.totalSpent) : 4
    const earned = prod ? Math.floor(prod.price * tier / 100) : 0
    const useBonusVal = Math.min(useBonus, customer?.usableBonus || 0)
    const newTotal = customer ? customer.totalBonus + earned - useBonusVal : 0
    const newUsable = Math.floor(newTotal * 0.5)

  function handlePhoneChange(val: string) {
        const clean = val.replace(/\D/g, '').slice(0, 8)
        setPhone(clean)
        setNotFound(false)
        setCustomer(null)
        if (clean.length > 0) {
                const matches = customers.filter(c => c.phone.startsWith(clean))
                setSuggestions(matches)
                setShowSuggestions(matches.length > 0)
        } else {
                setSuggestions([])
                setShowSuggestions(false)
        }
  }

  function selectCustomer(c: any) {
        setPhone(c.phone)
        setCustomer({ ...c })
        setNotFound(false)
        setShowSuggestions(false)
        setSuggestions([])
  }

  function search() {
        const c = customers.find(x => x.phone === phone)
        if (c) { setCustomer({ ...c }); setNotFound(false) }
        else { setCustomer(null); setNotFound(true) }
        setShowSuggestions(false)
  }

  function doSale() {
        if (!customer || !prod) return
        const tx = { name: customer.name, prod: prod.name, amt: prod.price, earned, time: new Date().toLocaleTimeString() }
        setTodayTxs(p => [tx, ...p])
        const updated = { ...customer, totalSpent: customer.totalSpent + prod.price, totalBonus: newTotal, usableBonus: newUsable }
        setCustomers(prev => {
                const updated2 = prev.map(c => c.id === customer.id ? updated : c)
                if (typeof window !== 'undefined') {
                          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated2))
                }
                return updated2
        })
        setCustomer(updated)
        setProdId('')
        setUseBonus(0)
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
                                <a href="/dashboard/sale" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Борлуулалт</a>a>
                                <a href="/dashboard/customers" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хэрэглэгчид</a>a>
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
                                <h1 className="text-sm font-semibold">Борлуулалт</h1>h1>
                                <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">Туршилтын горим</span>span>
                      </header>header>
                      <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                          <p className="text-xs text-gray-400 uppercase mb-2">Хэрэглэгч хайх</p>p>
                                                          <div className="bg-white rounded-xl border p-4 mb-4">
                                                                          <div className="relative mb-3">
                                                                                            <div className="flex gap-2">
                                                                                                                <div className="relative flex-1">
                                                                                                                                      <input
                                                                                                                                                                ref={inputRef}
                                                                                                                                                                value={phone}
                                                                                                                                                                onChange={e => handlePhoneChange(e.target.value)}
                                                                                                                                                                onKeyDown={e => e.key === 'Enter' && search()}
                                                                                                                                                                placeholder="Утасны дугаар..."
                                                                                                                                                                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"
                                                                                                                                                              />
                                                                                                                  {showSuggestions && (
                                  <div ref={suggestRef} className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                                    {suggestions.map(c => (
                                                                <button
                                                                                                key={c.id}
                                                                                                onMouseDown={() => selectCustomer(c)}
                                                                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left"
                                                                                              >
                                                                                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                                                                {c.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                                                                </div>div>
                                                                                              <div className="flex-1 min-w-0">
                                                                                                                              <div className="text-sm font-medium text-gray-800">{c.name}</div>div>
                                                                                                                              <div className="text-xs text-gray-400">{c.phone}</div>div>
                                                                                                </div>div>
                                                                                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{getTier(c.totalSpent)}%</span>span>
                                                                </button>button>
                                                              ))}
                                  </div>div>
                                                                                                                                      )}
                                                                                                                  </div>div>
                                                                                                                <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Хайх</button>button>
                                                                                              </div>div>
                                                                          </div>div>
                                                            {notFound && <p className="text-red-500 text-sm text-center">Хэрэглэгч олдсонгүй</p>p>}
                                                            {customer && (
                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">{customer.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</div>div>
                                                                      <div className="flex-1">
                                                                                              <div className="text-sm font-semibold">{customer.name}</div>div>
                                                                                              <div className="text-xs text-gray-400">{customer.phone}</div>div>
                                                                      </div>div>
                                                                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{getTier(customer.totalSpent)}%</span>span>
                                                </div>div>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold">{fmt(customer.totalSpent)}</div>div><div className="text-xs text-gray-400">Зарцуулалт</div>div></div>div>
                                                                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold text-green-600">{customer.totalBonus.toLocaleString()}</div>div><div className="text-xs text-gray-400">Бонус</div>div></div>div>
                                                                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold text-purple-600">{customer.usableBonus.toLocaleString()}</div>div><div className="text-xs text-gray-400">Ашиглах</div>div></div>div>
                                                </div>div>
                            </div>div>
                                                                          )}
                                                          </div>div>
                                                          <p className="text-xs text-gray-400 uppercase mb-2">Бүтээгдэхүүн</p>p>
                                                          <div className="bg-white rounded-xl border p-4">
                                                                          <div className="mb-3">
                                                                                            <label className="text-xs text-gray-500 mb-1 block">Бүтээгдэхүүн</label>label>
                                                                                            <select value={prodId} onChange={e => setProdId(e.target.value)} disabled={!customer} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400 disabled:bg-gray-50">
                                                                                                                <option value="">— Сонгох —</option>option>
                                                                                              {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>option>)}
                                                                                              </select>select>
                                                                          </div>div>
                                                                          <div className="mb-3">
                                                                                            <label className="text-xs text-gray-500 mb-1 block">Үнэ</label>label>
                                                                                            <input readOnly value={prod ? fmt(prod.price) : ''} placeholder="Бүтээгдэхүүн сонгоно уу" className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none"/>
                                                                          </div>div>
                                                                          <div className="mb-4">
                                                                                            <label className="text-xs text-gray-500 mb-1 block">Бонус ашиглах</label>label>
                                                                                            <input type="number" min={0} max={customer?.usableBonus || 0} value={useBonus} onChange={e => setUseBonus(parseInt(e.target.value) || 0)} disabled={!customer} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400 disabled:bg-gray-50"/>
                                                                          </div>div>
                                                            {prod && customer && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3 text-xs">
                                                <div className="flex justify-between mb-1"><span className="text-gray-500">Олгох бонус:</span>span><span className="font-semibold text-green-600">+{earned.toLocaleString()}</span>span></div>div>
                                                <div className="flex justify-between mb-1"><span className="text-gray-500">Ашиглах бонус:</span>span><span className="font-semibold text-red-500">-{useBonusVal.toLocaleString()}</span>span></div>div>
                                                <div className="flex justify-between"><span className="text-gray-500">Шинэ бонус:</span>span><span className="font-semibold text-blue-600">{newTotal.toLocaleString()}</span>span></div>div>
                            </div>div>
                                                                          )}
                                                                          <button onClick={doSale} disabled={!customer || !prod} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700">Борлуулалт бүртгэх</button>button>
                                                          </div>div>
                                            </div>div>
                                            <div>
                                                          <p className="text-xs text-gray-400 uppercase mb-2">Өнөөдрийн борлуулалт</p>p>
                                                          <div className="bg-white rounded-xl border p-4 min-h-40">
                                                            {todayTxs.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center mt-8">Өнөөдөр гүйлгээ байхгүй</p>p>
                          ) : (
                            <div className="space-y-2">
                              {todayTxs.map((tx, i) => (
                                                    <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                                                                            <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-semibold">
                                                                              {tx.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                                                                              </div>div>
                                                                            <div className="flex-1">
                                                                                                      <div className="text-xs font-semibold">{tx.name}</div>div>
                                                                                                      <div className="text-xs text-gray-400">{tx.prod} · {fmt(tx.amt)}</div>div>
                                                                              </div>div>
                                                                            <div className="text-right">
                                                                                                      <div className="text-xs text-green-600 font-semibold">+{tx.earned.toLocaleString()}</div>div>
                                                                                                      <div className="text-xs text-gray-400">{tx.time}</div>div>
                                                                              </div>div>
                                                    </div>div>
                                                  ))}
                            </div>div>
                                                                          )}
                                                          </div>div>
                                            </div>div>
                                </div>div>
                      </div>div>
              </main>main>
        </div>div>
      )
}</div>
