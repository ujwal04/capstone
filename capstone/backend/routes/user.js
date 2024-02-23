const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AccessRequest = require('../models/accessRequest');
const Course = require('../models/course');

// User Registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashedPassword, userType: "user" });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Registration failed.', error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user in the database
        const user = await User.findOne({ email });

        if (user) {
            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Passwords match, generate a token
                const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, 'your-secret-key', { expiresIn: '1h' });

                // Include the token in the response
                res.status(200).json({ message: 'Login successful', user, token, success: true });
            } else {
                // Passwords don't match, return error
                res.status(401).json({ message: 'Invalid credentials', success: false });
            }
        } else {
            // User not found, return error
            res.status(401).json({ message: 'Invalid credentials', success: false });
        }
    } catch (error) {
        // Handle errors
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error', success: false });
    }
});

router.get('/initialize-users', async (req, res) => {
    try {
        // Fetch users from the JSON file
        const usersJson = require('../users.json');

        // Check if any of the users with the given emails already exist in the database
        const existingUsers = await User.find({ email: { $in: usersJson.map(user => user.email) } });

        if (existingUsers.length === 0) {
            // No users with the given emails in the database, proceed with initialization

            // Save each user to the user's local database
            for (const user of usersJson) {
                await User.create(user);
            }

            res.status(200).json({ message: 'Users initialized successfully.' });
        } else {
            // Users with the given emails already exist, skip initialization
            res.status(200).json({ message: 'Users with the given emails already exist in the database.' });
        }
    } catch (error) {
        console.error('Error initializing users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to get all access requests
router.get('/access-requests', async (req, res) => {
    try {
        const accessRequests = await AccessRequest.find().populate('courseId').populate('userId');
        res.json(accessRequests);
    } catch (error) {
        console.error('Error fetching access requests:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle access request
router.post('/request-access', async (req, res) => {
    const { courseId, userId } = req.body;
    try {
        // Check if the user has already requested access
        const existingRequest = await AccessRequest.findOne({ courseId, userId });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'Access already requested.' });
        }

        // Create a new access request
        const newRequest = new AccessRequest({ courseId, userId });
        await newRequest.save();

        res.status(201).json({ success: true, message: 'Access requested successfully.' });
    } catch (error) {
        console.error('Error requesting access:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
});

router.post('/request-access', async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.userId; // Assuming userId is available in the request (you may need to modify this based on your authentication setup)

    try {
        // Check if the user has already requested access
        const existingRequest = await AccessRequest.findOne({ courseId, userId });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: 'Access already requested.' });
        }

        // Create a new access request
        const newRequest = new AccessRequest({ courseId, userId });
        await newRequest.save();

        res.status(201).json({ success: true, message: 'Access requested successfully.' });
    } catch (error) {
        console.error('Error requesting access:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
});



// router.post('/grant-access', async (req, res) => {
//     const { requestId } = req.body;

//     try {
//         // Update the access request to mark it as granted
//         await AccessRequest.findByIdAndUpdate(requestId, { granted: true });

//         // Fetch the access request details
//         const accessRequest = await AccessRequest.findById(requestId).populate('userId');

//         // Update the user's course to mark it as granted
//         await User.findByIdAndUpdate(accessRequest.userId._id, { $set: { isAccessGranted: true } });

//         res.status(200).json({ success: true, message: 'Access granted successfully.' });
//     } catch (error) {
//         console.error('Error granting access:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// routes/users.js
router.post('/grant-access', async (req, res) => {
    const { requestId } = req.body;

    try {
        // Update the access request to mark it as granted
        await AccessRequest.findByIdAndUpdate(requestId, { granted: true });

        // Fetch the access request details
        const accessRequest = await AccessRequest.findById(requestId);

        // Check if the access request exists and is granted
        if (!accessRequest || !accessRequest.granted) {
            return res.status(404).json({ success: false, message: 'Access request not found or not granted.' });
        }

        // Update the user's course to mark it as granted
        await User.findByIdAndUpdate(accessRequest.userId, { $set: { isAccessGranted: true } });

        // Fetch the updated course information
        const updatedCourse = await Course.findById(accessRequest.courseId);

        res.status(200).json({ success: true, message: 'Access granted successfully.', course: updatedCourse });
    } catch (error) {
        console.error('Error granting access:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;
