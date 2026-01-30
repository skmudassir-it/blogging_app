import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PostView from '../components/PostView';
import { ArrowLeft } from 'lucide-react';

const PostPage = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                to="/"
                className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition font-medium"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Home
            </Link>
            <PostView postId={id} />
        </div>
    );
};

export default PostPage;
