import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const allowedCategories = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Health & Beauty',
  'Automotive',
  'Toys & Games',
  'Jewelry & Accessories',
  'Pet Supplies',
  'Office & School',
  'Baby & Kids',
  'Tools & Hardware',
  'Other'
];

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const col = await getCollection('products');

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brandName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
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

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.message.includes('MongoDB') || error.message.includes('connection')) {
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    // Optional auth (page is protected)
    let userId;
    let userEmail;
    try {
      const token = await getToken({ req: request, secret: authOptions.secret });
      userId = token?.id || token?.sub;
      userEmail = token?.email;
      if (!userId) {
        const session = await getServerSession(authOptions);
        userId = session?.user?.id;
        if (!userEmail) userEmail = session?.user?.email;
      }
    } catch {}

    const body = await request.json();
    const { title, category, price, stockQuantity, description, image } = body;

    if (!title || !category || price === undefined || stockQuantity === undefined || !description || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, price, stockQuantity, description, image' },
        { status: 400 }
      );
    }

    const coercedPrice = typeof price === 'number' ? price : parseFloat(price);
    const coercedStock = typeof stockQuantity === 'number' ? stockQuantity : parseInt(stockQuantity);

    if (!Number.isFinite(coercedPrice) || coercedPrice <= 0) {
      return NextResponse.json({ error: 'Price must be a positive number' }, { status: 400 });
    }
    if (!Number.isInteger(coercedStock) || coercedStock < 0) {
      return NextResponse.json({ error: 'Stock quantity must be a non-negative integer' }, { status: 400 });
    }

    if (typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 });
    }
    if (!allowedCategories.includes(String(category).trim())) {
      return NextResponse.json({ error: 'Please select a valid category' }, { status: 400 });
    }
    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json({ error: 'Description must be a non-empty string' }, { status: 400 });
    }
    if (typeof image !== 'string' || !/^https?:\/\//i.test(image)) {
      return NextResponse.json({ error: 'Image must be a valid URL (http/https)' }, { status: 400 });
    }

    const doc = {
      title: title.trim(),
      category: String(category).trim(),
      price: coercedPrice,
      stockQuantity: coercedStock,
      description: description.trim(),
      image: image.trim(),
      status: body.status ?? 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (userId) doc.creator = userId;
    if (userEmail) doc.creatorEmail = String(userEmail).trim();
    if (body.creatorEmail && !doc.creatorEmail) doc.creatorEmail = String(body.creatorEmail).trim();

    if (body.brandName) doc.brandName = String(body.brandName).trim();
    if (body.sku) doc.sku = String(body.sku).trim();

    if (body.discountPrice !== undefined && body.discountPrice !== '') {
      const dp = typeof body.discountPrice === 'number' ? body.discountPrice : parseFloat(body.discountPrice);
      if (!Number.isFinite(dp) || dp < 0) {
        return NextResponse.json({ error: 'Discount price must be a non-negative number' }, { status: 400 });
      }
      doc.discountPrice = dp;
    }

    if (Array.isArray(body.tags)) doc.tags = body.tags.map(t => String(t).trim()).filter(Boolean);

    const col = await getCollection('products');

    if (doc.sku) {
      const dup = await col.findOne({ sku: doc.sku });
      if (dup) return NextResponse.json({ error: 'SKU already exists. Please use a unique SKU.' }, { status: 400 });
    }

    await col.insertOne(doc);

    const { _id, ...product } = doc;
    return NextResponse.json({ message: 'Product created successfully', product }, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
