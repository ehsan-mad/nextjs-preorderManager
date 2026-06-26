import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PreorderForm from '@/app/_components/PreorderForm';

export const metadata = { title: 'Edit Preorder' };

export default async function EditPreorderPage({ params }) {
  const { id } = await params;
  const preorder = await prisma.preorder.findUnique({ where: { id } });
  if (!preorder) notFound();

  const serialized = {
    ...preorder,
    startDate: preorder.startDate ? preorder.startDate.toISOString() : null,
    endDate: preorder.endDate ? preorder.endDate.toISOString() : null,
    createdAt: preorder.createdAt.toISOString(),
    updatedAt: preorder.updatedAt.toISOString(),
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PreorderForm mode="edit" preorder={serialized} />
      </div>
    </main>
  );
}
