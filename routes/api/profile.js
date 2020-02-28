const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
// @route   GET api/profile/me
// @desc    GET current user profile
// @access  Public


const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        await res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

router.get('/me', auth, getUserProfile);

module.exports = router;