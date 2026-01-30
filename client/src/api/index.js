import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

// Posts
export const fetchPosts = () => API.get('/posts');
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.put(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);

// Post Interactions
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const dislikePost = (id) => API.post(`/posts/${id}/dislike`);
export const viewPost = (id) => API.post(`/posts/${id}/view`);
export const fetchRelatedPosts = (id) => API.get(`/posts/${id}/related`);

// Comments
export const fetchComments = (postId) => API.get(`/comments/post/${postId}`);
export const createComment = (commentData) => API.post('/comments', commentData);
export const likeComment = (id) => API.post(`/comments/${id}/like`);
export const dislikeComment = (id) => API.post(`/comments/${id}/dislike`);

// Uploads
export const uploadImage = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;
