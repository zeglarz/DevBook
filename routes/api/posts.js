const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/posts
// @desc    Add post
// @access  Private

const createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();

        await res.json(post);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], createPost);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        if (!posts) return res.status(400).json({ msg: 'No posts' });
        await res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

router.get('/', auth, getPosts);

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(400).json({ msg: 'No post with such id' });
        await res.json(post);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'No post with such id' });
        res.status(500).send('Server Error');
    }
};

router.get('/:id', auth, getPost);

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post not found' });


        // Check if it deleted by post owner
        if (post.user.toString() !== req.user.id) {
            console.log(post.user);
            return req.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove();
        await res.json({ msg: 'Post has been successfully removed.' });


    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'No post with such id' });
        res.status(500).send('Server Error');
    }
};

router.delete('/:id', auth, deletePost);

// @route   PUT api/posts/like/:id
// @desc    Add like to post
// @access  Private

const addLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has been already liked?
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });

        await post.save();

        await res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

router.put('/like/:id', auth, addLike);

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
const removeLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has been already liked?
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post is not liked by you' });
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
        post.likes.splice(removeIndex, 1);
        await post.save();

        await res.json({ msg: 'Like has been successfully removed.' });

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
};

router.put('/unlike/:id', auth, removeLike);

// @route   POST api/posts/comments/:id
// @desc    Add a comment to a post
// @access  Private

const addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], addComment);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from o a post by its id
// @access  Private

const removeComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        // Check user

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Cannot delete comment made by other user' });
        }

        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));
        post.comments.splice(removeIndex, 1);
        await post.save();

        await res.json(post.comments);

    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'Post or comment id invalid' });
        res.status(500).send('Server Error');
    }
};

router.delete('/comment/:id/:comment_id', auth, removeComment);

module.exports = router;
