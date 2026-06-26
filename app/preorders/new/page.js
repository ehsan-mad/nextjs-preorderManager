import PreorderForm from '@/app/_components/PreorderForm';

export const metadata = { title: 'Create Preorder' };

export default function CreatePreorderPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PreorderForm mode="create" />
      </div>
    </main>
  );
}
