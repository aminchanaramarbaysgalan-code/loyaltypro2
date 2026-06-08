import { prisma } from '@/lib/prisma'
import CustomersClient from './CustomersClient'

export const dynamic = 'force-dynamic'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; region?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ''
  const region = params.region || ''
  const page = parseInt(params.page || '1')
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
