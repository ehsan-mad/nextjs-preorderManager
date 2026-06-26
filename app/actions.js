'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function readField(source, key, fallback) {
  if (!source) return fallback;
  if (typeof source.get === 'function') {
    return source.get(key) ?? fallback;
  }
  return source[key] ?? fallback;
}

function readDateField(source, key) {
  const raw = readField(source, key, null);
  if (!raw) return null;
  const d = new Date(String(raw));
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Toggle a preorder's status between active and inactive
 */
export async function togglePreorderStatus(id) {
  try {
    const preorder = await prisma.preorder.findUnique({ where: { id } });
    if (!preorder) {
      return { error: 'Preorder not found' };
    }

    const newStatus = preorder.status === 'active' ? 'inactive' : 'active';
    const updated = await prisma.preorder.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath('/');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Toggle status error:', error);
    return { error: 'Failed to update status' };
  }
}

/**
 * Delete a preorder by id
 */
export async function deletePreorder(id) {
  try {
    const preorder = await prisma.preorder.findUnique({ where: { id } });
    if (!preorder) {
      return { error: 'Preorder not found' };
    }

    await prisma.preorder.delete({ where: { id } });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { error: 'Failed to delete preorder' };
  }
}

/**
 * Delete multiple preorders by ids
 */
export async function deleteMultiplePreorders(ids) {
  try {
    const result = await prisma.preorder.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath('/');
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Batch delete error:', error);
    return { error: 'Failed to delete preorders' };
  }
}

/**
 * Create a new preorder (supports both FormData and plain objects)
 */
export async function createPreorder(payload) {
  try {
    const name = String(readField(payload, 'name', '') ?? '').trim();
    const productCount = Number(readField(payload, 'productCount', 0));
    const preorderMode = String(readField(payload, 'preorderMode', 'standard'));
    const statusRaw = String(readField(payload, 'status', 'active'));

    const startDate = readDateField(payload, 'startDate');
    const endDate = readDateField(payload, 'endDate');

    if (!name) {
      return { error: 'Name is required' };
    }

    const created = await prisma.preorder.create({
      data: {
        name,
        productCount: Number.isFinite(productCount) ? productCount : 0,
        preorderMode: preorderMode || 'standard',
        status: statusRaw === 'inactive' ? 'inactive' : 'active',
        startDate,
        endDate,
      },
    });

    revalidatePath('/');
    redirect(`/`);
    return { success: true, data: created };
  } catch (error) {
    // next/navigation redirect throws; allow it to bubble up without logging as a "failure"
    if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Create preorder error:', error);
    return { error: 'Failed to create preorder' };
  }
}

/**
 * Update an existing preorder.
 * Supports:
 *  - updatePreorder(formDataOrPayload) with `id` included
 *  - updatePreorder(id, payload) (back-compat for any caller patterns)
 */
export async function updatePreorder(arg1, arg2) {
  try {
    const payload = arg2 ?? arg1;

    const idFromArg1 =
      typeof arg1 === 'string' ? arg1 : String(readField(arg1, 'id', '') ?? '').trim();
    const idFromPayload = String(readField(payload, 'id', '') ?? '').trim();

    const id = (idFromArg1 || idFromPayload).trim();
    const name = String(readField(payload, 'name', '') ?? '').trim();
    const productCount = Number(readField(payload, 'productCount', 0));
    const preorderMode = String(readField(payload, 'preorderMode', 'standard'));
    const statusRaw = String(readField(payload, 'status', 'active'));

    const startDate = readDateField(payload, 'startDate');
    const endDate = readDateField(payload, 'endDate');

    if (!id) return { error: 'Missing preorder id' };
    if (!name) return { error: 'Name is required' };

    const updated = await prisma.preorder.update({
      where: { id },
      data: {
        name,
        productCount: Number.isFinite(productCount) ? productCount : 0,
        preorderMode: preorderMode || 'standard',
        status: statusRaw === 'inactive' ? 'inactive' : 'active',
        startDate,
        endDate,
      },
    });

    revalidatePath('/');
    redirect(`/`);
    return { success: true, data: updated };
  } catch (error) {
    if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Update preorder error:', error);
    return { error: 'Failed to update preorder' };
  }
}

/**
 * Get a single preorder by id
 */
export async function getPreorder(id) {
  try {
    const preorder = await prisma.preorder.findUnique({ where: { id } });
    if (!preorder) {
      return { error: 'Preorder not found' };
    }
    return { success: true, data: preorder };
  } catch (error) {
    console.error('Get preorder error:', error);
    return { error: 'Failed to fetch preorder' };
  }
}
