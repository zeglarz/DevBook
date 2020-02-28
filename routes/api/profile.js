const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');

// @route   GET api/profile/me
// @desc    GET current user profile
// @access  Private

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

const createProfile = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, {
                new: true
            });
            return res.json(profile);
        }
        // Create
        profile = new Profile(profileFields);

        await profile.save();
        await res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @route   GET api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/',
    [
        auth,
        [
            check('status', 'Status is required')
                .not()
                .isEmpty(),
            check('skills', 'Skills are required')
                .not()
                .isEmpty()
        ]], createProfile);

// @route   GET api/profile/
// @desc    GET all profiles
// @access  Public

const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        ;
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

router.get('/', getAllProfiles);

// @route   GET api/profile/user/user_id
// @desc    GET user by user ID
// @access  Public

const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });
        res.json(profile);

    } catch (err) {
        console.error(err.message);

        if (err.kind === 'ObjectId') return res.status(400).json({ msg: 'Profile not found' });

        res.status(500).send('Server Error');
    }
};

router.get('/user/:user_id', getProfile);

// @route   DELETE api/profile/
// @desc    Delete profile,user & posts
// @access  Private

const deleteProfile = async (req, res) => {
    try {
        // @todo - remove users posts
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        await res.json({ msg: 'successfully removed' });

    } catch (err) {
        ;
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

router.delete('/', auth, deleteProfile);

module.exports = router;