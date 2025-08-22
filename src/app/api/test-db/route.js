import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const db = await getCollection('products');
    
    // Try to count documents
    const count = await db.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      collection: 'products',
      documentCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
