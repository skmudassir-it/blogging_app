import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    <Link to="/" className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
                        Blog<span className="text-indigo-600">Shaik</span>.
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link
                            to="/admin"
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-black transition shadow-md flex items-center gap-2"
                        >
                            <PenTool size={16} /> Admin Dashboard
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
