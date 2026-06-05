import prisma from '@/lib/prisma'
import CustomersClient from './CustomersClient'

export const dynamic = 'force-dynamic'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string; region?: string; page?: string }
}) {
  const search = searchParams.search || ''
  const region = searchParams.region || ''
  const page = parseInt(searchParams.page || '1')
  const pageSize = 50

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
    ]
  }
  if (region) {
    where.region = region
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.customer.count({ where }),
  ])

  return (
    <CustomersClient
      customers={customers}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      region={region}
    />
  )
}
