'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
}

const tierColor: Record<number, string> = {
  4: 'bg-blue-50 text-blue-600',
  6: 'bg-green-50 text-green-600',
  7: 'bg-amber-50 text-amber-600',
  8: 'bg-purple-50 text-purple-600',
}

interface Customer {
  id: string
  name: string
  phone: string
  region: string | null
  totalSpent: number
  currentTier: number
  totalBonus: number
  usableBonus: number
  createdAt: Date
  updatedAt: Date
}

interface Props {
  customers: Customer[]
  total: number
  page: number
  pageSize: number
  search: string
  region: string
}

export default function CustomersClient({ customers, total, page, pageSize, search, region }: Props) {
  const router = useRouter()
  const [detail, setDetail] = useState<Customer | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ last: '', first: '', phone: '', region: '' })
  const [err, setErr] = useState('')

  const totalPages = Math.ceil(total / pageSize)

  function handleSearch(val: string) {
    const params = new URLSearchParams()
    if (val) params.set('search', val)
    if (region) params.set('region', region)
    params.set('page', '1')
    router.push('/dashboard/customers?' + params.toString())
  }

  function handleRegion(val: string) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (val) params.set('region', val)
    params.set('page', '1')
    router.push('/dashboard/customers?' + params.toString())
  }

  function handlePage(p: number) {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (region) params.set('region', region)
    params.set('page', String(p))
    router.push('/dashboard/customers?' + params.toString())
  }

  async function addCustomer() {
    setErr('')
    if (!form.last || !form.first) { setErr('Нэр оруулна уу'); return }
    if (form.phone.length !== 8) { setErr('8 оронтой утас оруулна уу'); return }
    if (!form.region) { setErr('Бүс сонгоно уу'); return }
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.last + ' ' + form.first, phone: form.phone, region: form.region }),
    })
    if (res.ok) {
      setForm({ last: '', first: '', phone: '', region: '' })
      setShowAdd(false)
      router.refresh()
    } else {
      const d = await res.json()
      setErr(d.error || 'Алдаа гарлаа')
    }
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
          <a href="/dashboard/customers" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Хэрэглэгчид</a>
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
          <h1 className="text-sm font-semibold">Хэрэглэгчид ({total.toLocaleString()})</h1>
          <button onClick={() => setShowAdd(true)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ Хэрэглэгч нэмэх</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-3 mb-4">
            <input
              defaultValue={search}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value) }}
              placeholder="Нэр эсвэл утасны дугаараар хайх... (Enter дарна уу)"
              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-400"
            />
            <select
              value={region}
              onChange={e => handleRegion(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-white outline-none"
            >
              <option value="">Бүх бүс</option>
              {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium w-8"></th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нэр</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Утас</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бүс</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Зарцуулалт</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Бонус</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Ашиглах</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-sm">Хэрэглэгч олдсонгүй</td></tr>
                ) : customers.map(c => {
                  const tier = getTier(c.totalSpent)
                  return (
                    <tr key={c.id} onClick={() => setDetail(c)} className="border-b last:border-0 hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">{initials(c.name)}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.phone}</td>
                      <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{REGIONS[c.region || ''] || c.region || '-'}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[tier]}`}>{tier}%</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{fmt(c.totalSpent)}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{c.totalBonus.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-purple-600 font-medium">{c.usableBonus.toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Нийт {total.toLocaleString()} хэрэглэгчийн {((page-1)*pageSize+1).toLocaleString()}–{Math.min(page*pageSize, total).toLocaleString()}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                >←</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      className={`px-3 py-1.5 border rounded-lg text-sm ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
                    >{p}</button>
                  )
                })}
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                >→</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Хэрэглэгч нэмэх</h2>
              <button onClick={() => { setShowAdd(false); setErr('') }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Овог</label>
                <input value={form.last} onChange={e => setForm(f => ({ ...f, last: e.target.value }))} placeholder="Батбаяр" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs text-gray-500">Нэр</label>
                <input value={form.first} onChange={e => setForm(f => ({ ...f, first: e.target.value }))} placeholder="Болд" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs text-gray-500">Утасны дугаар</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 8) }))} placeholder="99112233" className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-400"/>
              </div>
              <div>
                <label className="text-xs text-gray-500">Бүс нутаг</label>
                <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm outline-none">
                  <option value="">— Сонгох —</option>
                  {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {err && <p className="text-red-500 text-xs">{err}</p>}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setShowAdd(false); setErr('') }} className="flex-1 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Болих</button>
              <button onClick={addCustomer} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Нэмэх</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Хэрэглэгчийн мэдээлэл</h2>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-semibold">{initials(detail.name)}</div>
              <div>
                <div className="font-semibold text-gray-800">{detail.name}</div>
                <div className="text-xs text-gray-400">{detail.phone} · {REGIONS[detail.region || ''] || '-'}</div>
              </div>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${tierColor[getTier(detail.totalSpent)]}`}>{getTier(detail.totalSpent)}% tier</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-700">{fmt(detail.totalSpent)}</div>
                <div className="text-xs text-gray-400 mt-1">Нийт зарцуулалт</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-green-600">{detail.totalBonus.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Нийт бонус</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-purple-600">{detail.usableBonus.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Ашиглах боломж</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-700">{getTier(detail.totalSpent)}%</div>
                <div className="text-xs text-gray-400 mt-1">Одоогийн tier</div>
              </div>
            </div>
            <button onClick={() => setDetail(null)} className="w-full py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">Хаах</button>
          </div>
        </div>
      )}
    </div>
  )
}
