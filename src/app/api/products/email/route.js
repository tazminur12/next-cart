import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    if (!email) {
      return NextResponse.json({ error: 'Missing email parameter' }, { status: 400 });
    }

    const col = await getCollection('products');

    const query = { creatorEmail: String(email).trim() };
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await col.countDocuments(query);
    const items = await col
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const products = items.map(({ _id, ...doc }) => ({ id: String(_id), ...doc }));

    const allForEmail = await col
      .find({ creatorEmail: String(email).trim() })
      .project({ status: 1, stockQuantity: 1, _id: 0 })
      .toArray();

    const stats = {
      total: allForEmail.length,
      active: allForEmail.filter(p => p.status === 'active').length,
      draft: allForEmail.filter(p => p.status === 'draft').length,
      inactive: allForEmail.filter(p => p.status === 'inactive').length,
      totalStock: allForEmail.reduce((s, p) => s + (p.stockQuantity || 0), 0)
    };

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      },
      stats
    });
  } catch (error) {
    console.error('GET /api/products/email error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
