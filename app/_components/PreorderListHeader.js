import Link from 'next/link';

export default function PreorderListHeader() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">Preorders</h1>
      <Link
        href="/preorders/new"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Create Preorder
      </Link>
    </div>
  );
}
