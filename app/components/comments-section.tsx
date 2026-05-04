import { getCommentsByPostId } from '@/lib/comments';
import { CommentsClient } from './comments-client';

interface CommentsSectionProps {
  postId: string;
}

export async function CommentsSection({ postId }: CommentsSectionProps) {
  const comments = await getCommentsByPostId(postId);

  return <CommentsClient initialComments={comments} />;
}
