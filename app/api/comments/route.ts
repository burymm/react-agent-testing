import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/comments';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, name, email, text } = body;

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: 'Name and text are required' },
      { status: 400 }
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  const comment = addComment({
    postId,
    name: name.trim(),
    email: email?.trim() || '',
    text: text.trim(),
  });

  return NextResponse.json(comment, { status: 201 });
}
