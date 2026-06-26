'use client';

import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition, useRef, useEffect } from 'react';
import { deletePreorder, togglePreorderStatus } from '@/app/actions';

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-gray-900' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SortDropdown({ currentSort, currentOrder, onApply }) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState(currentSort || 'createdAt');
  const [dir, setDir] = useState(currentOrder || 'desc');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fields = [
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'startDate', label: 'Starts At' },
    { value: 'endDate', label: 'Ends At' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center rounded border border-gray-200 p-1.5 hover:bg-gray-50"
        aria-label="Sort"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-3">
            <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sort by</p>
            <div className="space-y-1">
              {fields.map((f) => (
                <label key={f.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name="sortField"
                    value={f.value}
                    checked={field === f.value}
                    onChange={() => setField(f.value)}
                    className="accent-gray-900"
                  />
                  {f.label}
                </label>
              ))}
            </div>
            <div className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => setDir('asc')}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm ${
                  dir === 'asc' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>↑</span> Ascending
              </button>
              <button
                type="button"
                onClick={() => setDir('desc')}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm ${
                  dir === 'desc' ? 'bg-gray-900 text-white font-medium' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>↓</span> Descending
              </button>
            </div>
          </div>
          <div className="border-t px-3 py-2">
            <button
              type="button"
              onClick={() => { onApply(field, dir); setOpen(false); }}
              className="w-full rounded bg-gray-900 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreorderTable({
  preorders,
  currentSort,
  currentOrder,
  currentStatus,
  page,
  total,
  limit,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState([]);
  const [pendingToggle, setPendingToggle] = useState(null);

  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  function buildParams(overrides = {}) {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v == null || v === '') p.delete(k);
      else p.set(k, String(v));
    });
    return p.toString();
  }

  function navigate(overrides) {
    startTransition(() => {
      router.push(`${pathname}?${buildParams(overrides)}`);
    });
  }

  function setTab(status) {
    navigate({ status: status || '', page: 1 });
  }

  function applySort(field, dir) {
    navigate({ sort: field, order: dir, page: 1 });
  }

  const allChecked = preorders.length > 0 && selected.length === preorders.length;
  const someChecked = selected.length > 0 && selected.length < preorders.length;

  function toggleAll() {
    setSelected(allChecked ? [] : preorders.map((p) => p.id));
  }

  function toggleRow(id) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  async function handleToggle(id, current) {
    setPendingToggle(id);
    await togglePreorderStatus(id);
    setPendingToggle(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this preorder?')) return;
    await deletePreorder(id);
    router.refresh();
  }

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  return (
    <div className="rounded-lg bg-white shadow overflow-hidden">
      {/* Tabs + sort row */}
      <div className="flex items-center justify-between border-b px-4 pt-3 pb-0">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                currentStatus === t.value
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <SortDropdown currentSort={currentSort} currentOrder={currentOrder} onApply={applySort} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Preorder when</th>
              <th className="px-4 py-3">Starts at</th>
              <th className="px-4 py-3">Ends at</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {preorders?.length ? (
              preorders.map((p) => (
                <tr key={p.id} className="text-sm hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleRow(p.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.productCount}</td>
                  <td className="px-4 py-3 text-gray-600">{p.preorderMode}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.startDate ? formatDateTime(p.startDate) : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.endDate ? formatDateTime(p.endDate) : ''}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={p.status === 'active'}
                      onChange={() => handleToggle(p.id, p.status)}
                      disabled={pendingToggle === p.id}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/preorders/${p.id}`} aria-label="Edit" className="text-gray-500 hover:text-gray-900">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => handleDelete(p.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 4h12M5.333 4V2.667h5.334V4M6.667 7.333v4M9.333 7.333v4M3.333 4l.667 9.333h8L12.667 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-gray-500" colSpan={8}>
                  No preorders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 border-t px-4 py-3 relative">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => navigate({ page: page - 1 })}
          className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 10.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="text-sm text-gray-600">
          Showing {start} to {end} from {total}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => navigate({ page: page + 1 })}
          className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3.5L9 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

function formatDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  const yr = d.getFullYear();
  let hr = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');
  const ampm = hr >= 12 ? 'PM' : 'AM';
  hr = hr % 12 || 12;
  return `${mo}/${dy}/${yr}, ${String(hr).padStart(2, '0')}:${min} ${ampm}`;
}
