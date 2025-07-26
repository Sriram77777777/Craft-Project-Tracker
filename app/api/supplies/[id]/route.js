import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongodb';
import Supply from '@/models/Supply';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    await dbConnect();

    const supply = await Supply.findOneAndUpdate(
      { _id: params.id, user: session.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!supply) {
      return NextResponse.json(
        { message: 'Supply not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ supply });
  } catch (error) {
    console.error('Supply update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const supply = await Supply.findOneAndDelete({
      _id: params.id,
      user: session.user.id
    });

    if (!supply) {
      return NextResponse.json(
        { message: 'Supply not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Supply deleted successfully' });
  } catch (error) {
    console.error('Supply deletion error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
