const express = require('express');
const Course = require('../models/course');
const app = express()
const router = express.Router();
const { verifyToken } = require('../jwt');

const multer = require('multer'); // Import Multer for handling file uploads

// Set up Multer storage
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/courses', verifyToken, async (req, res) => {
    if (req.user && req.user.userType === 'admin') {
        const course = new Course({
            title: req.body.title,
            description: req.body.description,
            isAccessGranted: req.body.isAccessGranted || false,
            image: req.body.image
        });

        try {
            const newCourse = await course.save();
            res.status(201).json(newCourse);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized: Only admin can add courses.' });
    }
});

// Add a new route to update a course by ID
router.put('/courses/:id', verifyToken, async (req, res) => {
    const courseId = req.params.id;
    const { title, description, isAccessGranted, image } = req.body;

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        // Check if the user is an admin or faculty
        if (req.user && (req.user.userType === 'admin' || req.user.userType === 'faculty')) {
            // Update course details
            course.title = title;
            course.description = description;
            course.isAccessGranted = isAccessGranted || false;
            course.image = image;

            // Save the updated course to the database
            const updatedCourse = await course.save();

            res.json(updatedCourse);
        } else {
            res.status(403).json({ message: 'Unauthorized: Only admin or faculty can update courses.' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/courses/:id', verifyToken, async (req, res) => {
    // Check if the user is an admin
    if (req.user && req.user.userType === 'admin') {
        const courseId = req.params.id;

        try {
            // Delete the course by ID
            await Course.findByIdAndDelete(courseId);
            res.json({ message: 'Course deleted successfully.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized: Only admin can delete courses.' });
    }
});

router.post('/courses/upload-image', upload.single('image'), (req, res) => {
    try {
        // Check if a file is present in the request
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Process the uploaded file (save to a directory, database, etc.)
        // In this example, we'll just return the file data as a base64-encoded string
        const fileData = req.file.buffer.toString('base64');

        // You can save the file data to a database or storage system here

        // Respond with the file data or URL
        res.json({ imageData: fileData });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/initialize-courses', async (req, res) => {
    try {
        // Fetch courses from the JSON file
        const coursesJson = require('../courses.json');

        // Save each course to the user's local database
        for (const course of coursesJson) {
            await Course.create(course);
        }

        res.status(200).json({ message: 'Courses initialized successfully.' });
    } catch (error) {
        console.error('Error initializing courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
