import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId } from '@/lib/comments';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const comments = await getCommentsByPostId(id);
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
