'use client'
import { useState } from 'react'

const PRODUCTS = [
  { name: 'Хөх', price: 360000 },
  { name: 'Улаан', price: 220000 },
  { name: 'Желатин', price: 200000 },
  { name: 'Хүүхэд', price: 100000 },
  { name: 'Ногоон', price: 280000 },
]

const TXS = [
  { prod: 'Улаан', amt: 220000, pct: 4, earned: 8800, used: 0, region: 'WEST' },
  { prod: 'Хөх', amt: 360000, pct: 7, earned: 25200, used: 0, region: 'CENTER' },
  { prod: 'Ногоон', amt: 280000, pct: 8, earned: 22400, used: 50000, region: 'SOUTH' },
  { prod: 'Желатин', amt: 200000, pct: 6, earned: 12000, used: 0, region: 'EAST' },
  { prod: 'Хүүхэд', amt: 100000, pct: 4, earned: 4000, used: 0, region: 'WEST' },
]

const CUSTOMERS = [
  { region: 'WEST', totalSpent: 1500000, totalBonus: 60000 },
  { region: 'WEST', totalSpent: 800000, totalBonus: 32000 },
  { region: 'EAST', totalSpent: 2500000, totalBonus: 120000 },
  { region: 'CENTER', totalSpent: 5200000, totalBonus: 350000 },
  { region: 'SOUTH', totalSpent: 9100000, totalBonus: 700000 },
]

const REGIONS: Record<string, string> = {
  WEST: 'Баруун бүс', EAST: 'Зүүн бүс', SOUTH: 'Урд бүс', CENTER: 'Төв бүс'
}

function getTier(s: number) {
  if (s >= 8000000) return 8
  if (s >= 4000000) return 7
  if (s >= 2000000) return 6
  return 4
}

function fmt(n: number) { return n.toLocaleString() + '₮' }

export default function ReportsPage() {
  const totalSales = TXS.reduce((s, t) => s + t.amt, 0)
  const totalEarned = TXS.reduce((s, t) => s + t.earned, 0)
  const totalUsed = TXS.reduce((s, t) => s + t.used, 0)

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
          <a href="/dashboard/transactions" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Гүйлгээ</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Бүс нутаг</div>
          <a href="/dashboard/region/west" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Баруун бүс</a>
          <a href="/dashboard/region/east" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Зүүн бүс</a>
          <a href="/dashboard/region/south" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Урд бүс</a>
          <a href="/dashboard/region/center" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Төв бүс</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase mt-2">Систем</div>
          <a href="/dashboard/products" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Бүтээгдэхүүн</a>
          <a href="/dashboard/reports" className="block px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1">Тайлан</a>
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
          <h1 className="text-sm font-semibold">Тайлан</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-gray-800">{fmt(totalSales)}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт борлуулалт</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-green-600">{totalEarned.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт олгосон бонус</div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <div className="text-xl font-semibold text-purple-600">{totalUsed.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Нийт ашигласан бонус</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 uppercase mb-2">Бүтээгдэхүүнээр</div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Бүтээгдэхүүн</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Борлуулалт</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Дүн</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Бонус</th>
                  </tr></thead>
                  <tbody>
                    {PRODUCTS.map(p => {
                      const pTxs = TXS.filter(t => t.prod === p.name)
                      const total = pTxs.reduce((s, t) => s + t.amt, 0)
                      const bonus = pTxs.reduce((s, t) => s + t.earned, 0)
                      return (
                        <tr key={p.name} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-800">{p.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{pTxs.length}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{fmt(total)}</td>
                          <td className="px-4 py-2 text-sm text-green-600 font-medium">{bonus.toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-400 uppercase mb-2">Бүсээр</div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Бүс</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Хэрэглэгч</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Зарцуулалт</th>
                    <th className="text-left px-4 py-2 text-xs text-gray-400 font-medium">Бонус</th>
                  </tr></thead>
                  <tbody>
                    {Object.entries(REGIONS).map(([key, name]) => {
                      const rCusts = CUSTOMERS.filter(c => c.region === key)
                      const rSpent = rCusts.reduce((s, c) => s + c.totalSpent, 0)
                      const rBonus = rCusts.reduce((s, c) => s + c.totalBonus, 0)
                      return (
                        <tr key={key} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-800">{name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{rCusts.length}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{fmt(rSpent)}</td>
                          <td className="px-4 py-2 text-sm text-green-600 font-medium">{rBonus.toLocaleString()}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400 uppercase mb-2">Tier тархалт</div>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Tier</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Хэрэглэгч тоо</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нийт зарцуулалт</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Нийт бонус</th>
              </tr></thead>
              <tbody>
                {[4, 6, 7, 8].map(pct => {
                  const tc = CUSTOMERS.filter(c => getTier(c.totalSpent) === pct)
                  return (
                    <tr key={pct} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tierColor[pct]}`}>{pct}%</span></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{tc.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{fmt(tc.reduce((s, c) => s + c.totalSpent, 0))}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{tc.reduce((s, c) => s + c.totalBonus, 0).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}