const router = require('express').Router();
const Comment = require('../models/Comment');

// GET comments for a specific post
router.get('/post/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new comment
router.post('/', async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST like a comment
router.post('/:id/like', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST dislike a comment
router.post('/:id/dislike', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { $inc: { dislikes: 1 } },
            { new: true }
        );
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
