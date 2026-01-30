import React, { useEffect, useState } from 'react';
import {
    fetchPost, likePost, dislikePost, viewPost,
    fetchComments, createComment, likeComment, dislikeComment
} from '../api';
import {
    Calendar, Eye, Heart, ThumbsDown
} from 'lucide-react';
// Import Quill styles for rendering the content correctly
import 'react-quill-new/dist/quill.snow.css';

const PostView = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Comment Form State
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('Guest');
    const [replyTo, setReplyTo] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [postRes, commentsRes] = await Promise.all([
                    fetchPost(postId),
                    fetchComments(postId)
                ]);

                setPost(postRes.data);
                setComments(commentsRes.data);

                await viewPost(postId);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (postId) loadData();
    }, [postId]);

    const handleLike = async () => {
        const { data } = await likePost(postId);
        setPost(prev => ({ ...prev, likes: data.likes }));
    };

    const handleDislike = async () => {
        const { data } = await dislikePost(postId);
        setPost(prev => ({ ...prev, dislikes: data.dislikes }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const payload = {
            postId,
            author: authorName,
            content: newComment,
            parentCommentId: replyTo
        };

        const { data } = await createComment(payload);
        setComments([data, ...comments]);
        setNewComment('');
        setReplyTo(null);
    };

    const handleCommentLike = async (commentId) => {
        const { data } = await likeComment(commentId);
        setComments(comments.map(c => c._id === commentId ? data : c));
    };

    const handleCommentDislike = async (commentId) => {
        const { data } = await dislikeComment(commentId);
        setComments(comments.map(c => c._id === commentId ? data : c));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!post) return <div className="text-center">Post not found</div>;

    const rootComments = comments.filter(c => !c.parentCommentId);
    const getReplies = (parentId) => comments.filter(c => c.parentCommentId === parentId);

    const CommentItem = ({ comment, depth = 0 }) => {
        const replies = getReplies(comment._id);
        return (
            <div className={`mb-6 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900">{comment.author}</div>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <p className="text-gray-700 mb-2 text-sm">{comment.content}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button onClick={() => handleCommentLike(comment._id)} className="flex items-center gap-1 hover:text-red-500 transition">
                        <Heart size={12} /> {comment.likes}
                    </button>
                    <button onClick={() => handleCommentDislike(comment._id)} className="flex items-center gap-1 hover:text-gray-900 transition">
                        <ThumbsDown size={12} /> {comment.dislikes}
                    </button>
                    <button
                        onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Reply
                    </button>
                </div>

                {replyTo === comment._id && (
                    <form onSubmit={handleCommentSubmit} className="mt-3">
                        <input
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            placeholder={`Reply to ${comment.author}...`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            autoFocus
                        />
                    </form>
                )}

                {replies.map(reply => (
                    <CommentItem key={reply._id} comment={reply} depth={depth + 1} />
                ))}
            </div>
        );
    };

    return (
        <article className="overflow-hidden"> {/* Fix overflow issue */}
            {post.coverImage && (
                <div className="w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <header className="mb-8 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-medium font-mono">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                        {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Eye size={14} /> {post.views}
                    </span>
                </div>
            </header>

            {/* Google Ad Placeholder - Top */}
            <div className="w-full h-32 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-8 mx-auto text-gray-400 text-sm font-medium tracking-widest uppercase">
                Google Ad Slot
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Content Area with rich text styles */}
                <div className="prose prose-lg prose-indigo max-w-none text-gray-800 leading-relaxed mb-8 select-text break-words ql-editor px-0">
                    <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="[&>p]:mb-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>img]:rounded-lg [&>img]:my-6 [&>img]:w-full"
                    />
                </div>

                <div className="flex items-center justify-center gap-8 py-8 border-t border-b border-gray-100 mb-12">
                    <button onClick={handleLike} className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 transition group p-4 rounded-xl hover:bg-gray-50">
                        <Heart size={28} className={post.likes > 0 ? "fill-current text-red-500" : "group-hover:scale-110 transition-transform"} />
                        <span className="font-bold text-sm">{post.likes} Likes</span>
                    </button>
                    <button onClick={handleDislike} className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-900 transition group p-4 rounded-xl hover:bg-gray-50">
                        <ThumbsDown size={28} className="group-hover:translate-y-1 transition-transform" />
                        <span className="font-bold text-sm">{post.dislikes} Dislikes</span>
                    </button>
                </div>

                {/* Google Ad Placeholder - Bottom */}
                <div className="w-full h-64 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center mb-16 text-gray-400 text-sm font-medium tracking-widest uppercase">
                    Google Ad Slot
                </div>

                <section className="bg-gray-50 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>
                    <form onSubmit={handleCommentSubmit} className="mb-10">
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                className="w-full md:w-1/2 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                placeholder="Your Name"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                            />
                            <textarea
                                className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                placeholder="Add a comment..."
                                rows="3"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="text-right">
                                <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg">
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </form>
                    <div>
                        {rootComments.map(comment => (
                            <CommentItem key={comment._id} comment={comment} />
                        ))}
                        {rootComments.length === 0 && <p className="text-gray-400 text-center py-4">No comments yet.</p>}
                    </div>
                </section>
            </div>
        </article>
    );
};

export default PostView;
