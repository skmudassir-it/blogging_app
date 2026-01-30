import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../api';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const { data } = await fetchPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        getPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 md:py-20 mb-12">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                    Blog<span className="text-indigo-600">Shaik</span>.
                </h1>
                <p className="text-xl text-gray-500 font-medium">Stories, thinking, and expertise.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                {posts.map((post) => (
                    <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        className="group block"
                    >
                        <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-all">
                            {post.coverImage ? (
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-2xl">
                                    {post.title[0]}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                {post.excerpt || post.content.replace(/<[^>]*>/g, '')}
                            </p>
                            <div className="pt-2 flex items-center justify-between text-sm text-gray-400 font-medium">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                    <Heart size={14} className={post.likes > 0 ? "fill-current text-red-500" : ""} /> {post.likes}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
