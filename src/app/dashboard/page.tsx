'use client'

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="font-semibold text-sm">🏆 LoyaltyPro</div>
          <div className="text-xs text-gray-400 mt-1">Бонус удирдлага</div>
        </div>
        <nav className="p-2 flex-1">
          <div className="text-xs text-gray-400 px-2 py-2 uppercase tracking-wider">Үндсэн</div>
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 mb-1 cursor-pointer">Хяналтын самбар</a>
          <a href="/dashboard/sale" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Борлуулалт</a>
          <a href="/dashboard/customers" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Хэрэглэгчид</a>
          <a href="/dashboard/transactions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Гүйлгээ</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase tracking-wider mt-2">Бүс нутаг</div>
          <a href="/dashboard/region/west" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Баруун бүс</a>
          <a href="/dashboard/region/east" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Зүүн бүс</a>
          <a href="/dashboard/region/south" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Урд бүс</a>
          <a href="/dashboard/region/center" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Төв бүс</a>
          <div className="text-xs text-gray-400 px-2 py-2 uppercase tracking-wider mt-2">Систем</div>
          <a href="/dashboard/products" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Бүтээгдэхүүн</a>
          <a href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 mb-1">Тайлан</a>
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
          <h1 className="text-sm font-semibold text-gray-800">Хяналтын самбар</h1>
          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">● Онлайн</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Нийт хэрэглэгч', value: '0', color: 'text-blue-600' },
              { label: 'Өнөөдрийн борлуулалт', value: '0₮', color: 'text-green-600' },
              { label: 'Өнөөдрийн бонус', value: '0', color: 'text-amber-600' },
              { label: 'Нийт гүйлгээ', value: '0', color: 'text-purple-600' },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl border p-4">
                <div className={`text-2xl font-semibold ${c.color}`}>{c.value}</div>
                <div className="text-xs text-gray-400 mt-1">{c.label}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Бүсийн статистик</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Баруун бүс', mgr: 'Чинтогтох', color: 'bg-purple-50 text-purple-700' },
              { name: 'Зүүн бүс', mgr: 'Наранбаатар', color: 'bg-green-50 text-green-700' },
              { name: 'Урд бүс', mgr: 'Булгантамир', color: 'bg-amber-50 text-amber-700' },
              { name: 'Төв бүс', mgr: 'Баттулга', color: 'bg-blue-50 text-blue-700' },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-xl border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Менежер: {r.mgr}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.color}`}>{r.name.split(' ')[0]}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Хэрэглэгч', value: '0' },
                    { label: 'Бонус', value: '0' },
                    { label: 'Гүйлгээ', value: '0' },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-sm font-semibold text-gray-700">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}