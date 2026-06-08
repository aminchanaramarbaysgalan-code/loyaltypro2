'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

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

export default function SalePage() {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const [prodId, setProdId] = useState('')
  const [useBonus, setUseBonus] = useState(0)
  const [todayTxs, setTodayTxs] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const searchSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 1) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch('/api/customers/search?q=' + encodeURIComponent(q))
      if (res.ok) {
        const data = await res.json()
        setSuggestions(data)
        setShowSuggestions(data.length > 0)
      }
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
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
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (clean.length > 0) {
      debounceRef.current = setTimeout(() => { searchSuggestions(clean) }, 200)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function selectCustomer(c: any) {
    setPhone(String(c.phone))
    setCustomer({ ...c })
    setNotFound(false)
    setShowSuggestions(false)
    setSuggestions([])
  }

  async function search() {
    setShowSuggestions(false)
    if (!phone) return
    setIsSearching(true)
    try {
      const res = await fetch('/api/customers/search?q=' + encodeURIComponent(phone))
      if (res.ok) {
        const data = await res.json()
        const exact = data.find((c: any) => String(c.phone) === phone)
        if (exact) { setCustomer({ ...exact }); setNotFound(false) }
        else { setCustomer(null); setNotFound(true) }
      }
    } catch {
      setCustomer(null); setNotFound(true)
    } finally {
      setIsSearching(false)
    }
  }

  function doSale() {
    if (!customer || !prod) return
    const tx = { name: customer.name, prod: prod.name, amt: prod.price, earned, time: new Date().toLocaleTimeString() }
    setTodayTxs(p => [tx, ...p])
    const updated = { ...customer, totalSpent: customer.totalSpent + prod.price, totalBonus: newTotal, usableBonus: newUsable }
    setCustomer(updated)
    setProdId('')
    setUseBonus(0)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r flex flex-col flex-shrink-0">
        <div className="p-4 border-b">
          <div className="font-semibold text-sm">LoyaltyPro</div>
          <div className="text-xs text-gray-400 mt-1">Бонус удирдлага</div>
        </div>
        <nav className="p-2 flex-1">
          <div className="text-xs text-gray-400 px-2 py-2 uppercase">Үндсэн</div>
          <a href="/dashboard" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хяналтын самбар</a>
          <a href="/dashboard/sale" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Борлуулалт</a>
          <a href="/dashboard/customers" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хэрэглэгчид</a>
          <a href="/dashboard/transactions" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Гүйлгээ</a>
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
          <h1 className="text-sm font-semibold">Борлуулалт</h1>
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">Туршилтын горим</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Хэрэглэгч хайх</p>
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
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {showSuggestions && (
                        <div ref={suggestRef} className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-64 overflow-y-auto">
                          {suggestions.map(c => (
                            <button key={c.id} onMouseDown={() => selectCustomer(c)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {String(c.name).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-800">{c.name}</div>
                                <div className="text-xs text-gray-400">{c.phone}</div>
                              </div>
                              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{getTier(c.totalSpent)}%</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Хайх</button>
                  </div>
                </div>
                {notFound && <p className="text-red-500 text-sm text-center">Хэрэглэгч олдсонгүй</p>}
                {customer && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                        {String(customer.name).split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{customer.name}</div>
                        <div className="text-xs text-gray-400">{customer.phone}</div>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{getTier(customer.totalSpent)}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold">{fmt(customer.totalSpent)}</div><div className="text-xs text-gray-400">Зарцуулалт</div></div>
                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold text-green-600">{customer.totalBonus.toLocaleString()}</div><div className="text-xs text-gray-400">Бонус</div></div>
                      <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs font-semibold text-purple-600">{customer.usableBonus.toLocaleString()}</div><div className="text-xs text-gray-400">Ашиглах</div></div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 uppercase mb-2">Бүтээгдэхүүн</p>
              <div className="bg-white rounded-xl border p-4">
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">Бүтээгдэхүүн</label>
                  <select value={prodId} onChange={e => setProdId(e.target.value)} disabled={!customer} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400 disabled:bg-gray-50">
                    <option value="">-- Сонгох --</option>
                    {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name} -- {fmt(p.price)}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-1 block">Үнэ</label>
                  <input readOnly value={prod ? fmt(prod.price) : ''} placeholder="Бүтээгдэхүүн сонгоно уу" className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 outline-none" />
                </div>
                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-1 block">Бонус ашиглах</label>
                  <input type="number" min={0} max={customer?.usableBonus || 0} value={useBonus} onChange={e => setUseBonus(parseInt(e.target.value) || 0)} disabled={!customer} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400 disabled:bg-gray-50" />
                </div>
                {prod && customer && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3 text-xs">
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Олгох бонус:</span><span className="font-semibold text-green-600">+{earned.toLocaleString()}</span></div>
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Ашиглах бонус:</span><span className="font-semibold text-red-500">-{useBonusVal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Шинэ бонус:</span><span className="font-semibold text-blue-600">{newTotal.toLocaleString()}</span></div>
                  </div>
                )}
                <button onClick={doSale} disabled={!customer || !prod} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700">Борлуулалт бүртгэх</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Өнөөдрийн борлуулалт</p>
              <div className="bg-white rounded-xl border p-4 min-h-40">
                {todayTxs.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center mt-8">Өнөөдөр гүйлгээ байхгүй</p>
                ) : (
                  <div className="space-y-2">
                    {todayTxs.map((tx, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                        <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-semibold">
                          {tx.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold">{tx.name}</div>
                          <div className="text-xs text-gray-400">{tx.prod} · {fmt(tx.amt)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-600 font-semibold">+{tx.earned.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">{tx.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
