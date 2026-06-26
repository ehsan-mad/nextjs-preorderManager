'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createPreorder, updatePreorder } from '@/app/actions';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-gray-900' : 'bg-gray-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function FieldRow({ label, description, children }) {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-6 py-5 border-b last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
      </div>
      <div className="flex items-start">{children}</div>
    </div>
  );
}

export default function PreorderForm({ mode, preorder }) {
  const isEdit = mode === 'edit';
  const router = useRouter();

  const initial = useMemo(() => ({
    id: preorder?.id || '',
    name: preorder?.name || '',
    productCount: preorder?.productCount ?? 1,
    preorderMode: preorder?.preorderMode || 'regardless-of-stock',
    status: preorder?.status || 'active',
    startDate: preorder?.startDate ? toDateTimeLocal(preorder.startDate) : '',
    endDate: preorder?.endDate ? toDateTimeLocal(preorder.endDate) : '',
  }), [preorder]);

  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function toDateTimeLocal(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    };

    const result = isEdit ? await updatePreorder(payload) : await createPreorder(payload);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  const preorderModeOptions = [
    { value: 'regardless-of-stock', label: 'regardless-of-stock' },
    { value: 'out-of-stock', label: 'out-of-stock' },
    { value: 'standard', label: 'standard' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="preorder-form"
            disabled={saving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-lg bg-white shadow">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Preorder details</h2>
            <p className="text-sm text-gray-500">These values appear in the preorders list.</p>
          </div>

          {error && (
            <div className="mx-6 mt-2 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form id="preorder-form" onSubmit={onSubmit} className="px-6 pb-6">
            <FieldRow
              label={<>Name <span className="text-red-500">*</span></>}
              description="A label to recognize this preorder by."
            >
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                required
              />
            </FieldRow>

            <FieldRow
              label="Products"
              description="Number of products covered by this preorder."
            >
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={form.productCount}
                  onChange={(e) => set('productCount', e.target.value)}
                />
                <span className="text-sm text-gray-900">product(s)</span>
              </div>
            </FieldRow>

            <FieldRow
              label="Preorder when"
              description="When customers are allowed to preorder."
            >
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={form.preorderMode}
                onChange={(e) => set('preorderMode', e.target.value)}
              >
                {preorderModeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </FieldRow>

            <FieldRow
              label="Starts at"
              description="When the preorder window opens."
            >
              <input
                type="datetime-local"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
            </FieldRow>

            <FieldRow
              label="Ends at"
              description="Leave empty for no end date."
            >
              <input
                type="datetime-local"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </FieldRow>

            <FieldRow
              label="Status"
              description="Active preorders are visible to customers."
            >
              <div className="flex items-center gap-3">
                <Toggle
                  checked={form.status === 'active'}
                  onChange={() => set('status', form.status === 'active' ? 'inactive' : 'active')}
                />
                <span className="text-sm text-gray-900">
                  {form.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </FieldRow>
          </form>
        </div>

        {/* Bottom action bar */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="preorder-form"
            disabled={saving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
