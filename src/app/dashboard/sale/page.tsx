'use client'
import { useState } from 'react'

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
  const [customers, setCustomers] = useState<any[]>([
    { id: 1, name: 'Батбаяр Болд', phone: '99112233', totalSpent: 1500000, totalBonus: 60000, usableBonus: 30000 },
    { id: 2, name: 'Дорж Сарнай', phone: '88223344', totalSpent: 2500000, totalBonus: 120000, usableBonus: 60000 },
  ])

  const prod = PRODUCTS.find(p => p.id === parseInt(prodId))
  const tier = customer ? getTier(customer.totalSpent) : 4
  const earned = prod ? Math.floor(prod.price * tier / 100) : 0
  const useBonusVal = Math.min(useBonus, customer?.usableBonus || 0)
  const newTotal = customer ? customer.totalBonus + earned - useBonusVal : 0
  const newUsable = Math.floor(newTotal * 0.5)
  const newTier = customer ? getTier(customer.totalSpent + (prod?.price || 0)) : 4

  function search() {
    const c = customers.find(x => x.phone === phone)
    if (c) { setCustomer({ ...c }); setNotFound(false) }
    else { setCustomer(null); setNotFound(true) }
  }

  function doSale() {
    if (!customer || !prod) return
    const tx = { name: customer.name, prod: prod.name, amt: prod.price, earned, time: new Date().toLocaleTimeString() }
    setTodayTxs(p => [tx, ...p])
    const updated = { ...customer, totalSpent: customer.totalSpent + prod.price, totalBonus: newTotal, usableBonus: newUsable }
    setCustomers(p => p.map(c => c.id === customer.id ? updated : c))
    setCustomer(updated)
    setProdId('')
    setUseBonus(0)
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
                <div className="flex gap-2 mb-3">
                  <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,8))} onKeyDown={e => e.key==='Enter'&&search()} placeholder="Утасны дугаар..." className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
                  <button onClick={search} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Хайх</button>
                </div>
                {notFound && <p className="text-red-500 text-sm text-center">Хэрэглэгч олдсонгүй</p>}
                {customer && (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">{customer.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}</div>
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
                  <label className="text-xs text-gray-500">Бүтээгдэхүүн</label>
                  <select value={prodId} onChange={e=>setProdId(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none">
                    <option value="">— Сонгох —</option>
                    {PRODUCTS.map(p=><option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500">Үнэ</label>
                  <input readOnly value={prod?fmt(prod.price):''} placeholder="Бүтээгдэхүүн сонгоно уу" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"/>
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500">Бонус ашиглах</label>
                  <input type="number" min={0} value={useBonus||''} onChange={e=>setUseBonus(parseInt(e.target.value)||0)} placeholder="0" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none"/>
                </div>
                {prod && customer && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-xs">
                    <p className="font-semibold text-green-700 mb-2">Бонус тооцоолол</p>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-gray-500">Үнэ:</span><span className="font-medium">{fmt(prod.price)}</span>
                      <span className="text-gray-500">Tier:</span><span className="font-medium">{tier}%</span>
                      <span className="text-gray-500">Олгох бонус:</span><span className="text-green-600 font-medium">+{earned.toLocaleString()}</span>
                      {useBonusVal>0&&<><span className="text-gray-500">Ашиглах:</span><span className="text-purple-600 font-medium">-{useBonusVal.toLocaleString()}</span></>}
                      <span className="text-gray-500">Дараа нийт:</span><span className="font-medium">{newTotal.toLocaleString()}</span>
                      <span className="text-gray-500">Ашиглах (50%):</span><span className="text-purple-600 font-medium">{newUsable.toLocaleString()}</span>
                      {newTier!==tier&&<><span className="text-gray-500">Tier:</span><span className="text-amber-600 font-medium">{tier}%→{newTier}%</span></>}
                    </div>
                  </div>
                )}
                <button onClick={doSale} disabled={!customer||!prod} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:bg-gray-200 disabled:text-gray-400">Борлуулалт бүртгэх</button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase mb-2">Өнөөдрийн борлуулалт</p>
              <div className="bg-white rounded-xl border overflow-hidden">
                {todayTxs.length===0?(
                  <div className="text-center py-10 text-gray-400 text-sm">Өнөөдөр гүйлгээ байхгүй</div>
                ):(
                  <table className="w-full">
                    <thead><tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-2 text-xs text-gray-400">Хэрэглэгч</th>
                      <th className="text-left px-4 py-2 text-xs text-gray-400">Бүтээг</th>
                      <th className="text-left px-4 py-2 text-xs text-gray-400">Дүн</th>
                      <th className="text-left px-4 py-2 text-xs text-gray-400">Бонус</th>
                    </tr></thead>
                    <tbody>{todayTxs.map((t,i)=>(
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-medium">{t.name}</td>
                        <td className="px-4 py-2"><span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{t.prod}</span></td>
                        <td className="px-4 py-2 text-xs">{fmt(t.amt)}</td>
                        <td className="px-4 py-2 text-xs text-green-600 font-medium">+{t.earned.toLocaleString()}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}