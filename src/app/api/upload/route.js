import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// POST /api/upload - Upload image to ImgBB
export async function POST(request) {
  try {
    // Check if IMGBB_API_KEY is available
    if (!process.env.IMGBB_API_KEY) {
      console.error('IMGBB_API_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, message: 'Image upload service not configured' },
        { status: 500 }
      );
    }
    
  
    const session = await getServerSession(authOptions);
   
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required. Please log in first.' },
        { status: 401 }
      );
    }
    
    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Validate file size (ImgBB has a 32MB limit, but let's be conservative)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return NextResponse.json(
        { success: false, message: 'File is empty' },
        { status: 400 }
      );
    }
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    
    
    try {
      // Use URLSearchParams instead of FormData for better Node.js compatibility
      const params = new URLSearchParams();
      params.append('image', base64Image);
      params.append('key', process.env.IMGBB_API_KEY);
      
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });
      
    
      if (!response.ok) {
        const errorText = await response.text();
        console.error('ImgBB error response:', errorText);
        throw new Error(`ImgBB upload failed: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
    
      
      if (!result.success) {
        console.error('ImgBB API error:', result.error);
        throw new Error(result.error?.message || 'ImgBB upload failed');
      }
      
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully',
        url: result.data.url,
        data: {
          url: result.data.url,
          display_url: result.data.display_url,
          delete_url: result.data.delete_url,
          title: result.data.title,
          size: result.data.size
        }
      });
      
    } catch (fetchError) {
      console.error('Fetch error during ImgBB upload:', fetchError);
      throw new Error(`Network error during upload: ${fetchError.message}`);
    }
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
