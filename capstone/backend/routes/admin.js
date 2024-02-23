// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../jwt');

// Route to get all members
router.get('/members', verifyToken, async (req, res) => {
    try {
        const currentUserEmail = req.user.email; // Access the user information from req.user
        const members = await User.find({ email: { $ne: currentUserEmail } }, 'email userType');
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/member', verifyToken, async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newMember = new User({ email, password: hashedPassword, userType });
        await newMember.save();
        res.status(201).json({ success: true, message: 'Member added successfully.' });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(400).json({ success: false, message: 'Failed to add member.', error });
    }
});

router.delete('/members/:email', verifyToken, async (req, res) => {
    const memberemail = req.params.email;

    try {
        await User.findOneAndDelete(memberemail);
        res.json({ success: true, message: 'Member deleted successfully.' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ success: false, message: 'Failed to delete member.', error });
    }
});

module.exports = router;
