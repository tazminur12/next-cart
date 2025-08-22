import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(request) {
  try {
    // Pagination and filters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    // Best-effort user id
    let userId;
    try {
      const token = await getToken({ req: request, secret: authOptions.secret });
      userId = token?.id || token?.sub;
      if (!userId) {
        const session = await getServerSession(authOptions);
        userId = session?.user?.id;
      }
    } catch {}

    // If not logged in, return empty set (no redirect from API)
    if (!userId) {
      return NextResponse.json({
        products: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        },
        stats: { total: 0, active: 0, draft: 0, inactive: 0, totalStock: 0 }
      });
    }

    const col = await getCollection('products');

    const query = { creator: userId };
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

    const allForUser = await col.find({ creator: userId }).project({ status: 1, stockQuantity: 1, _id: 0 }).toArray();
    const stats = {
      total: allForUser.length,
      active: allForUser.filter(p => p.status === 'active').length,
      draft: allForUser.filter(p => p.status === 'draft').length,
      inactive: allForUser.filter(p => p.status === 'inactive').length,
      totalStock: allForUser.reduce((s, p) => s + (p.stockQuantity || 0), 0)
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
    console.error('GET /api/products/my-products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
