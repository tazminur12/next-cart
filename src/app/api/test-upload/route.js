import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Check environment variables
    const envCheck = {
      IMGBB_API_KEY: process.env.IMGBB_API_KEY ? 'Present' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Present' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    };
    
    // Test ImgBB API connection
    let imgbbTest = 'Not tested';
    if (process.env.IMGBB_API_KEY) {
      try {
        const testParams = new URLSearchParams();
        testParams.append('image', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        testParams.append('key', process.env.IMGBB_API_KEY);
        
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: testParams.toString()
        });
        
        if (response.ok) {
          const result = await response.json();
          imgbbTest = result.success ? 'Working' : `API Error: ${result.error?.message || 'Unknown error'}`;
        } else {
          imgbbTest = `HTTP Error: ${response.status}`;
        }
      } catch (error) {
        imgbbTest = `Connection Error: ${error.message}`;
      }
    }
    
    return NextResponse.json({
      environment: envCheck,
      imgbbTest,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test upload error:', error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
