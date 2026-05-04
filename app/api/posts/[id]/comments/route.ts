import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostId } from '@/lib/comments';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = getCommentsByPostId(id);
  return NextResponse.json(comments);
}
