const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const request = require('request');
const config = require('config');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
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
    const profileFields = {
        user: req.user.id,
        company,
        location,
        website: website === '' ? '' : normalize(website, { forceHttps: true }),
        bio,
        skills: Array.isArray(skills)
            ? skills
            : skills.split(',').map(skill => ' ' + skill.trim()),
        status,
        githubusername
    };
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

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private

const updateExperience = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } = req.body;

    const newExp = { title, company, location, from, to, current, description };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        await res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

router.put('/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty()

        ]
    ], updateExperience);

// @route   DELETE api/profile/experience/exp_id
// @desc    delete experience from profile
// @access  Private

const deleteExperience = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        await res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

router.delete('/experience/:exp_id', auth, deleteExperience);


// @route   DELETE api/profile/education
// @desc    delete education from profile
// @access  Private

const updateEducation = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } = req.body;

    const newEdu = { school, degree, fieldofstudy, from, to, current, description };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        await res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

};

router.put('/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty()

        ]
    ], updateEducation);

// @route   DELETE api/profile/education/edu_id
// @desc    delete education from profile
// @access  Private

const deleteEducation = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        await res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

const getGitHubProfile = async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error.message);
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }
            res.send(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
};

router.get('/github/:username', getGitHubProfile);

router.delete('/education/:edu_id', auth, deleteEducation);

// @route   GET api/profile/github/:username
// @desc    Get user repos from GitHub
// @access  Public


module.exports = router;
