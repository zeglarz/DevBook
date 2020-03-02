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


module.exports = router;