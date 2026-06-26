import { prisma } from '@/lib/prisma';
import PreorderTable from '@/app/_components/PreorderTable';
import PreorderListHeader from '@/app/_components/PreorderListHeader';

export const metadata = {
  title: 'Preorder Manager',
};

export default async function PreorderListPage({ searchParams }) {
  const params = await searchParams;
  const sort = params.sort || 'createdAt';
  const order = params.order === 'asc' ? 'asc' : 'desc';
  const statusFilter = params.status || '';
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 10));

  const where = {};
  if (statusFilter) where.status = statusFilter;

  const total = await prisma.preorder.count({ where });

  const preorders = await prisma.preorder.findMany({
    where,
    orderBy: { [sort]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Serialize dates to strings for client components
  const serialized = preorders.map((p) => ({
    ...p,
    startDate: p.startDate ? p.startDate.toISOString() : null,
    endDate: p.endDate ? p.endDate.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <PreorderListHeader />
        <PreorderTable
          preorders={serialized}
          currentSort={sort}
          currentOrder={order}
          currentSearch=""
          currentStatus={statusFilter}
          page={page}
          total={total}
          limit={limit}
        />
      </div>
    </main>
  );
}
