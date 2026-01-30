import React, { useEffect, useState, useRef } from 'react';
import { fetchPosts, deletePost, createPost, updatePost, fetchPost, uploadImage } from '../api';
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, Upload } from 'lucide-react';
import Modal from '../components/Modal';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const quillRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: 'Admin',
        excerpt: '',
        coverImage: ''
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const { data } = await fetchPosts();
        setPosts(data);
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            title: '',
            content: '',
            author: 'Admin',
            excerpt: '',
            coverImage: ''
        });
        setShowModal(true);
    };

    const handleEdit = async (id) => {
        setEditingId(id);
        const { data } = await fetchPost(id);
        setFormData({
            title: data.title,
            content: data.content,
            author: data.author,
            excerpt: data.excerpt,
            coverImage: data.coverImage || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deletePost(id);
            loadPosts();
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('file', file);

        try {
            setUploading(true);
            const res = await uploadImage(data);
            setFormData({ ...formData, coverImage: res.data.url });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Custom Image Handler for Quill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const data = new FormData();
            data.append('file', file);

            try {
                const res = await uploadImage(data);
                const url = res.data.url;

                // Insert image into editor
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
            } catch (error) {
                console.error('Editor image upload failed:', error);
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updatePost(editingId, formData);
            } else {
                await createPost(formData);
            }
            setShowModal(false);
            loadPosts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex justify-between items-center mb-8 pt-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Create Post
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wide">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold">Author</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{post.title}</div>
                                    <div className="text-xs text-gray-400 mt-1 line-clamp-1">{post.excerpt}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{post.author}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => handleEdit(post._id)}
                                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Editor Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingId ? 'Edit Post' : 'Create New Post'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-lg"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            />
                        </div>

                        {/* Cover Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                            <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-indigo-500 text-gray-500 hover:text-indigo-600 transition flex items-center justify-center gap-2">
                                        <Upload size={18} />
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            {formData.coverImage && (
                                <div className="mt-2 text-xs text-green-600 truncate flex items-center gap-1">
                                    <ImageIcon size={12} /> Image Selected
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows="2"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                modules={modules}
                                className="h-64 mb-12" // Add margin bottom for toolbar space
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
                        >
                            <Save size={20} />
                            {editingId ? 'Update Post' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
