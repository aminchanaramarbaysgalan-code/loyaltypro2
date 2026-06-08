import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') ?? ''

  if (!q || q.length < 1) {
        return NextResponse.json([])
  }

  try {
        const customers = await prisma.customer.findMany({
                where: {
                          phone: {
                                      startsWith: q,
                          },
                },
                select: {
                          id: true,
                          name: true,
                          phone: true,
                          totalSpent: true,
                          totalBonus: true,
                          usableBonus: true,
                          region: true,
                },
                take: 20,
                orderBy: {
                          phone: 'asc',
                },
        })
        return NextResponse.json(customers)
  } catch (error) {
        console.error('Customer search error:', error)
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
