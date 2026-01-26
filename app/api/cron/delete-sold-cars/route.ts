import { NextResponse } from 'next/server';
import { autoDeleteSoldCars } from '@/app/admin-upload-secret/actions';

export async function GET(request: Request) {
  // Verify the request is from your cron service
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await autoDeleteSoldCars();
    return NextResponse.json({ success: true, message: 'Sold cars deleted successfully' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sold cars' },
      { status: 500 }
    );
  }
}