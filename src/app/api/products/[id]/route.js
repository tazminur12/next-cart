import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { ObjectId } from 'mongodb';

async function getUserId(request) {
  let userId;
  try {
    const token = await getToken({ req: request, secret: authOptions.secret });
    userId = token?.id || token?.sub;
    if (!userId) {
      const session = await getServerSession(authOptions);
      userId = session?.user?.id;
    }
  } catch {}
  return userId;
}

function isAuthorized(found, userId, creatorEmailFromBody) {
  // Authorized if:
  // - userId exists and matches found.creator (or creator is absent)
  // - OR creatorEmail in body matches found.creatorEmail
  if (userId) {
    if (!found.creator || found.creator === userId) return true;
  }
  if (creatorEmailFromBody && found.creatorEmail && String(found.creatorEmail).toLowerCase() === String(creatorEmailFromBody).toLowerCase()) {
    return true;
  }
  return false;
}

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const col = await getCollection('products');
    const doc = await col.findOne({ _id: new ObjectId(id) });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { _id, ...product } = doc;
    return NextResponse.json({ product: { id, ...product } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const userId = await getUserId(request);
    const body = await request.json();
    const creatorEmailFromBody = body?.creatorEmail;

    const allowed = ['title','category','price','stockQuantity','description','image','status','brandName','sku','discountPrice','tags'];
    const update = {};
    for (const key of allowed) if (key in body) update[key] = body[key];
    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    const col = await getCollection('products');
    const found = await col.findOne({ _id: new ObjectId(id) });
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!isAuthorized(found, userId, creatorEmailFromBody)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    update.updatedAt = new Date();
    await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const userId = await getUserId(request);
    let creatorEmailFromBody;
    try {
      const body = await request.json();
      creatorEmailFromBody = body?.creatorEmail;
    } catch {}

    const col = await getCollection('products');
    const found = await col.findOne({ _id: new ObjectId(id) });
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!isAuthorized(found, userId, creatorEmailFromBody)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
